import { Compiler } from './compiler'
import { Factory } from './factory'
import { assertFunction } from '../assertions/function'
import { assertString } from '../assertions/string'
import { trim } from '../utilities'
import { assertObject } from '../assertions/object'

export class Route {
  constructor(path, view, additionalViews, redirectTo) {
    this._setDefaults()
    Factory._linkRoute(this)
    this._path = Factory._cleanPath(path)

    if (view) {
      this._components = Factory._resolveComponents(view, additionalViews)
    } else {
      this._redirect = redirectTo
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
    console.table(Factory._compile()._compiled)
  }

  name(name) {
    assertString(name, 'name')
    this._name = trim(name, Factory._nameSeparator)
    return this
  }

  alias(alias) {
    assertString(name, 'alias')
    this._alias = Factory._cleanPath(alias)
    return this
  }

  meta(key, value) {
    return this._setObject(this._meta, 'meta', key, value)
  }

  props(key, value) {
    return this._setObject(this._props, 'props', key, value)
  }

  prop(key, value) {
    assertString(key, 'prop.key')
    return this.props({ [key]: value })
  }

  guard(...guards) {
    for (const guard of guards) {
      assertString(guard, 'guard')
      this._guards.add(Factory._guard(guard))
    }

    return this
  }

  children(callable) {
    assertFunction(callable, 'children')
    return Factory._withChildren(this, callable)
  }

  static group(options, callable) {
    if (callable) {
      assertObject(options, 'group.options')
      assertFunction(callable, 'group')
    } else {
      assertFunction(options, 'group')
    }

    Factory._withinGroup(callable ? options : {}, callable || options)
  }

  _setDefaults() {
    this._path = undefined
    this._components = {}
    this._redirect = undefined
    this._nameClamp = undefined
    this._prefixClamp = undefined
    this._name = undefined
    this._children = []
    this._guards = new Set()
    this._alias = undefined
    this._meta = {}
    this._props = {}
  }

  _clampName(clampName) {
    assertString(clampName, 'clampName')
    const separator = Factory._nameSeparator

    this._nameClamp = trim(
      [this._nameClamp || undefined, this._name || undefined, clampName]
        .filter((clamp) => clamp !== undefined)
        .join(separator),
      separator
    )

    return this
  }

  _clampPrefix(clampPrefix) {
    assertString(clampPrefix, 'clampPrefix')

    this._prefixClamp = Factory._cleanPath(
      [this._prefixClamp || undefined, this._path || undefined, clampPrefix]
        .filter((clamp) => clamp !== undefined)
        .join('/')
    )

    return this
  }

  _setObject(on, context, key, value) {
    if (key instanceof Object) {
      Object.assign(on, key)
    } else if (value) {
      on[key] = value
    } else {
      throw `${context} must be passed as key,value or a key-value object.`
    }

    return this
  }

  _compile(nested) {
    return new Compiler(this)._compile(nested)
  }
}
