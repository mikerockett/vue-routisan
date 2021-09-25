import { Factory } from './factory'
import { guardError } from '../errors/guard-error'
import { trim, filterObject } from '../utilities'

export class Compiler {
  constructor(route) {
    this.route = route
  }

  compile(nested = false) {
    const children = this.route._children
    const compiled = {
      components: {},
      path: this.compilePath(nested),
      redirect: this.route._redirect,
      children: children.map((child) => child.compile(true)),
      name: children.length ? undefined : this.compileName(),
      alias: children.length ? undefined : this.route._alias,
      meta: children.length ? undefined : this.route._meta,
      props: children.length ? undefined : this.route._props,
    }

    this.components(compiled)

    if (this.route._guards.size > 0) {
      this.beforeEnter(compiled)
    }

    return filterObject(
      compiled,
      (item) => item instanceof Function
        ? false
        : item === undefined
          || item === ''
          || !Object.keys(item).length
    )
  }

  components(compiled) {
    for (const [name, component] of Object.entries(this.route._components)) {
      compiled.components[name] = component
    }
  }

  compilePath(nested) {
    const cleanedPath = trim([this.route._prefixClamp, this.route._path].join('/')) || (nested ? '/' : '')
    return nested ? cleanedPath : `/${cleanedPath}`
  }

  compileName() {
    const separator = Factory.nameSeparator
    const compiledName = [this.route._nameClamp, this.route._name].join(separator)

    return trim(compiledName, separator)
  }

  beforeEnter(compiled) {
    compiled.beforeEnter = (to, from, next) => {
      Array.from(this.route._guards)
        .reduce(this.guardChain({ from, to }), Promise.resolve())
        .then(this.guardResolver({ from, to }, next))
        .catch(this.guardRejector({ from, to }, next))
    }
  }

  guardChain({ from, to }) {
    return (chain, current) => {
      this.current = current
      return chain.then(() => current.promise({ from, to }))
    }
  }

  guardResolver(context, next) {
    return () => {
      this.current.logResolution(context)
      next()
    }
  }

  guardRejector(context, next) {
    return (rejection) => {
      this.current.logRejection(context, rejection)

      if (context.to.name == rejection.name || context.to.path === rejection.path) {
        throw guardError('rejection loop detected.')
      }

      rejection = rejection === undefined
        ? guardError('rejection handler missing.')
        : this.compileRejection(rejection)

      next(rejection)
    }
  }

  compileRejection(rejection) {
    return rejection instanceof Function ? rejection() : rejection
  }
}
