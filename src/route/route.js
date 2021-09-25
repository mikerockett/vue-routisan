import { Compiler } from './compiler'
import { Factory } from './factory'
import { trim } from '../utilities'

export class Route {
  constructor(path, view, additionalViews, redirectTo) {
    this.setDefaults()
    Factory.linkRoute(this)
    this._path = Factory.cleanPath(path)

    if (view) this._components = Factory.resolveComponents(view, additionalViews)
    else this._redirect = redirectTo
  }

  static view(path, view, additionalViews) {
    return new this(path, view, additionalViews)
  }

  static redirect(source, destination) {
    return new this(source, null, null, destination)
  }

  static dump() {
    console.log('Compiled Routes:')
    console.dir(Factory.compile().compiled)
  }

  name(name) {
    this._name = trim(name, Factory.nameSeparator)
    return this
  }

  alias(alias) {
    this._alias = Factory.cleanPath(alias)
    return this
  }

  meta(key, value) {
    return this.setObject(this._meta, 'meta', key, value)
  }

  props(key, value) {
    return this.setObject(this._props, 'props', key, value)
  }

  prop(key, value) {
    return this.props({ [key]: value })
  }

  guard(...guards) {
    for (const guard of guards) {
      this._guards.add(Factory.guard(guard))
    }

    return this
  }

  children(callable) {
    return Factory.withChildren(this, callable)
  }

  static group(options, callable) {
    Factory.withinGroup(callable ? options : {}, callable || options)
  }

  setDefaults() {
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

  clampName(clampName) {
    const separator = Factory.nameSeparator

    this._nameClamp = trim(
      [this._nameClamp || undefined, this._name || undefined, clampName]
        .filter((clamp) => clamp !== undefined)
        .join(separator),
      separator
    )

    return this
  }

  clampPrefix(clampPrefix) {

    this._prefixClamp = Factory.cleanPath(
      [this._prefixClamp || undefined, this._path || undefined, clampPrefix]
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
