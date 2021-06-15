import { Compiler } from './compiler'
import { Factory } from './factory'
import { assertFunction } from '../assertions/function'
import { assertString } from '../assertions/string'
import { trim } from '../utilities'
import { assertObject } from '../assertions/object'

export class Route {
  constructor(path, view, additionalViews, redirectTo) {
    this.setDefaults()
    Factory.linkRoute(this)
    this.path = Factory.cleanPath(path)

    if (view) {
      this.components = Factory.resolveComponents(view, additionalViews)
    } else {
      this.redirect = redirectTo
    }
  }

  static view(path, view, additionalViews) {
    assertString(path, 'view.path')
    return new this(path, view, additionalViews)
  }

  static redirect(source, destination) {
    assertString(source, 'source')
    return new this(source, null, null, destination)
  }

  static dump() {
    console.log('Compiled Routes:')
    console.table(Factory.compile().compiled)
  }

  name(name) {
    assertString(name, 'name')
    this.name = trim(name, Factory.nameSeparator)
    return this
  }

  alias(alias) {
    assertString(alias, 'alias')
    this.alias = Factory.cleanPath(alias)
    return this
  }

  meta(key, value) {
    return this.setObject(this.meta, 'meta', key, value)
  }

  props(key, value) {
    return this.setObject(this.props, 'props', key, value)
  }

  prop(key, value) {
    assertString(key, 'prop.key')
    return this.props({ [key]: value })
  }

  guard(...guards) {
    for (const guard of guards) {
      assertString(guard, 'guard')
      this.guards.add(Factory.guard(guard))
    }

    return this
  }

  children(callable) {
    assertFunction(callable, 'children')
    return Factory.withChildren(this, callable)
  }

  static group(options, callable) {
    if (callable) {
      assertObject(options, 'group.options')
      assertFunction(callable, 'group')
    } else {
      assertFunction(options, 'group')
    }

    Factory.withinGroup(callable ? options : {}, callable || options)
  }

  setDefaults() {
    this.path = undefined
    this.components = {}
    this.redirect = undefined
    this.nameClamp = undefined
    this.prefixClamp = undefined
    this.name = undefined
    this.children = []
    this.guards = new Set()
    this.alias = undefined
    this.meta = {}
    this.props = {}
  }

  clampName(clampName) {
    assertString(clampName, 'clampName')
    const separator = Factory.nameSeparator

    this.nameClamp = trim(
      [this.nameClamp || undefined, this.name || undefined, clampName]
        .filter((clamp) => clamp !== undefined)
        .join(separator),
      separator
    )

    return this
  }

  clampPrefix(clampPrefix) {
    assertString(clampPrefix, 'clampPrefix')

    this.prefixClamp = Factory.cleanPath(
      [this.prefixClamp || undefined, this.path || undefined, clampPrefix]
        .filter((clamp) => clamp !== undefined)
        .join('/')
    )

    return this
  }

  setObject(on, context, key, value) {
    if (key instanceof Object) {
      Object.assign(on, key)
    } else if (value) {
      on[key] = value
    } else {
      throw `${context} must be passed as key,value or a key-value object.`
    }

    return this
  }

  compile(nested) {
    return new Compiler(this).compile(nested)
  }
}
