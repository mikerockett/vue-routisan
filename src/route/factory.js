import { assertGuard } from '../assertions/guard'
import { RouteBag } from './bag'
import { stringPopulated, cleanRouteParam } from '../utilities'

export class Factory {

  static compiled = []
  static nameSeparator = '.'
  static guards = new Map()
  static childContexts = []
  static groupContexts = []
  static previousGroupContexts = []
  static resolver = (component) => component

  static usingResolver(resolver) {
    this.resolver = resolver
    return this
  }

  static withNameSeparator(separator) {
    this.nameSeparator = separator
    return this
  }

  static withGuards(guards) {
    for (const [name, guardClass] of Object.entries(guards)) {
      const guard = new guardClass(name)
      assertGuard(guard, 'guard[]')
      this.guards.set(name, guard)
    }

    return this
  }

  static guard(name) {
    return this.guards.get(name)
  }

  static resolveComponents(view, additionalViews, root = true) {
    const defaultComponent = this.resolver(view)
    const additionalComponents = {}

    if (additionalViews) for (const viewName in additionalViews) {
      components[viewName] = this.resolveComponents(additionalViews[viewName], null, false)
    }

    return root
      ? Object.assign({ default: defaultComponent }, additionalComponents)
      : defaultComponent
  }

  static cleanPath(path) {
    const separator = '/'

    const routePath = path
      .split(separator)
      .filter(stringPopulated)
      .map(cleanRouteParam)
      .join(separator)

    return this.childContexts.length || this.groupContexts.length
      ? routePath
      : separator + routePath
  }

  static linkRoute(route) {
    if (!this.routeBag) {
      this.routeBag = new RouteBag()
    }

    if (this.groupContexts.length) {
      const clampableName = this.groupContexts
        .map((options) => options.name)
        .join(this.nameSeparator)
        .trim()

      const clampablePrefix = this.groupContexts
        .map((options) => options.prefix)
        .join('/')
        .trim()

      const clampableGuards = this.groupContexts
        .map((options) => {
          const guards = Array.isArray(options.guard)
            ? options.guard
            : Array.of(options.guard)

          return guards.filter(guard => guard !== undefined)
        })

      if (clampableName) route.clampName(clampableName)
      if (clampablePrefix) route.clampPrefix(clampablePrefix)
      if (clampableGuards.length) route.guard(
        ...clampableGuards.reduce((flat, next) => flat.concat(next), [])
      )
    }

    if (this.childContexts.length) {
      route.clampName(this.childContexts.map((route) => route._name).join(this.nameSeparator))
      this.childContexts[this.childContexts.length - 1]._children.push(route)
    } else this.routeBag.pushRoute(route)
  }

  static withChildren(route, callable) {
    this.childContexts.push(route)

    if (this.groupContexts.length) {
      this.previousGroupContexts = Array.from(this.groupContexts)
      this.groupContexts = this.groupContexts.map(({ name, guard }) => ({ name, guard }))
    }

    callable()

    if (this.previousGroupContexts.length) {
      this.groupContexts = Array.from(this.previousGroupContexts)
    }

    this.childContexts.pop()

    return route
  }

  static withinGroup(options, callable) {
    this.groupContexts.push(options)
    callable()
    this.groupContexts.pop()
  }

  static compile() {
    this.compiled = this.routeBag
      ? this.routeBag.compiled()
      : []

    return this
  }

  static flush() {
    if (!this.compiled.length) this.compile()

    const compiled = this.compiled
    this.routeBag = new RouteBag()
    this.compiled = []

    return compiled
  }

  static routes() {
    return this.flush()
  }

  static dump() {
    console.log('Route Bag:')
    console.table(this.routeBag ? this.routeBag.routes : [])
  }
}
