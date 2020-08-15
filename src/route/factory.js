import { assertFunction } from '../assertions/function'
import { assertGuard } from '../assertions/guard'
import { assertObject } from '../assertions/object'
import { assertString } from '../assertions/string'
import { RouteBag } from './bag'
import { stringPopulated, cleanRouteParam } from '../utilities'

export class Factory {

  static _compiled = []
  static _nameSeparator = '.'
  static _guards = new Map()
  static _childContexts = []
  static _groupContexts = []
  static _previousGroupContexts = []
  static _resolver = (component) => component

  static usingResolver(resolver) {
    assertFunction(resolver, 'resolver')
    this._resolver = resolver
    return this
  }

  static withNameSeparator(separator) {
    assertString(separator, 'separator')
    this._nameSeparator = separator
    return this
  }

  static withGuards(guards) {
    assertObject(guards, 'guards')

    for (const [name, guardClass] of Object.entries(guards)) {
      const guard = new guardClass(name)
      assertGuard(guard, 'guard[]')
      this._guards.set(name, guard)
    }

    return this
  }

  static _guard(name) {
    return this._guards.get(name)
  }

  static _resolveComponents(view, additionalViews, root = true) {
    const defaultComponent = this._resolver(view)
    const additionalComponents = {}

    if (additionalViews) {
      assertObject(additionalViews, 'additionalViews')

      for (const viewName in additionalViews) {
        components[viewName] = this._resolveComponents(additionalViews[viewName], null, false)
      }
    }

    return root ? Object.assign({ default: defaultComponent }, additionalComponents) : defaultComponent
  }

  static _cleanPath(path) {
    const separator = '/'

    const routePath = assertString(path, 'path')
      .split(separator)
      .filter(stringPopulated)
      .map(cleanRouteParam)
      .join(separator)

    return this._childContexts.length || this._groupContexts.length
      ? routePath
      : separator + routePath
  }

  static _linkRoute(route) {
    if (!this._routeBag) {
      this._routeBag = new RouteBag()
    }

    if (this._groupContexts.length) {
      const clampableName = this._groupContexts
        .map((options) => options.name)
        .join(this._nameSeparator)
        .trim()

      const clampablePrefix = this._groupContexts
        .map((options) => options.prefix)
        .join('/')
        .trim()

      const clampableGuards = this._groupContexts
        .map((options) => {
          const guards = Array.isArray(options.guard) ? options.guard : Array.of(options.guard)
          return guards.filter(guard => guard !== undefined)
        })

      if (clampableName) {
        route._clampName(clampableName)
      }

      if (clampablePrefix) {
        route._clampPrefix(clampablePrefix)
      }

      if (clampableGuards.length) {
        route.guard(...clampableGuards.reduce((flat, next) => flat.concat(next), []))
      }
    }

    if (this._childContexts.length) {
      route._clampName(this._childContexts.map((route) => route._name).join(this._nameSeparator))
      this._childContexts[this._childContexts.length - 1]._children.push(route)
    } else {
      this._routeBag._pushRoute(route)
    }

  }

  static _withChildren(route, callable) {
    this._childContexts.push(route)

    if (this._groupContexts.length) {
      this._previousGroupContexts = Array.from(this._groupContexts)
      this._groupContexts = this._groupContexts.map(({ name, guard }) => ({ name, guard }))
    }

    callable()

    if (this._previousGroupContexts.length) {
      this._groupContexts = Array.from(this._previousGroupContexts)
    }

    this._childContexts.pop()

    return route
  }

  static _withinGroup(options, callable) {
    this._groupContexts.push(options)
    callable()
    this._groupContexts.pop()
  }

  static _compile() {
    this._compiled = this._routeBag
      ? this._routeBag._compiled()
      : []

    return this
  }

  static _flush() {
    if (!this._compiled) {
      this._compile()
    }

    const compiled = this._compiled
    this._routeBag = new RouteBag()
    this._compiled = []

    return compiled
  }

  static routes() {
    return Factory._flush()
  }

  static dump() {
    console.table(this._routeBag ? this._routeBag.routes() : [])
  }
}
