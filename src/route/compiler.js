import { assertIs } from '../assertions/is'
import { Factory } from './factory'
import { guardError } from '../errors/guard-error'
import { Route } from './route'
import { trim, filterObject } from '../utilities'

export class Compiler {
  constructor(route) {
    assertIs(route, 'route', Route, 'Route')
    this._route = route
  }

  _compile(nested = false) {
    const children = this._route._children
    const compiled = {
      components: {},
      path: this._compilePath(nested),
      redirect: this._route._redirect,
      children: children.map((child) => child._compile(true)),
      name: children.length ? undefined : this._compileName(),
      alias: children.length ? undefined : this._route._alias,
      meta: children.length ? undefined : this._route._meta,
      props: children.length ? undefined : this._route._props,
    }

    this._components(compiled)

    if (this._route._guards.size > 0) {
      this._beforeEnter(compiled)
    }

    return filterObject(compiled, (item) => {
      if (item instanceof Function) {
        return false
      }

      return item === undefined || item === '' || !Object.keys(item).length
    })
  }

  _components(compiled) {
    for (const [name, component] of Object.entries(this._route._components)) {
      compiled.components[name] = component
    }
  }

  _compilePath(nested) {
    const cleanedPath = trim([this._route._prefixClamp, this._route._path].join('/')) || (nested ? '/' : '')
    return nested ? cleanedPath : `/${cleanedPath}`
  }

  _compileName() {
    const separator = Factory._nameSeparator
    const compiledName = [this._route._nameClamp, this._route._name].join(separator)

    return trim(compiledName, separator)
  }

  _beforeEnter(compiled) {
    compiled.beforeEnter = (to, from, next) => {
      Array.from(this._route._guards)
        .reduce(this._guardChainHandler({ from, to }), Promise.resolve())
        .then(this._guardResolutionHandler({ from, to }, next))
        .catch(this._guardRejectionHandler({ from, to }, next))
    }
  }

  _guardChainHandler({ from, to }) {
    return (chain, current) => {
      this._current = current
      return chain.then(() => current._promise({ from, to }))
    }
  }

  _guardResolutionHandler(context, next) {
    return () => {
      this._current._logResolution(context)
      next()
    }
  }

  _guardRejectionHandler(context, next) {
    return (rejection) => {
      this._current._logRejection(context, rejection)

      if (context.to.name == rejection.name || context.to.path === rejection.path) {
        throw guardError('rejection loop detected.')
      }

      rejection = rejection === undefined
        ? guardError('rejection handler missing.')
        : this._compileRejection(rejection)

      next(rejection)
    }
  }

  _compileRejection(rejection) {
    return rejection instanceof Function ? rejection() : rejection
  }
}
