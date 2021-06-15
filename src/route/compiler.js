import { assertIs } from '../assertions/is'
import { Factory } from './factory'
import { guardError } from '../errors/guard-error'
import { Route } from './route'
import { trim, filterObject } from '../utilities'

export class Compiler {
  constructor(route) {
    assertIs(route, 'route', Route, 'Route')
    this.route = route
  }

  compile(nested = false) {
    const children = this.route.children
    const compiled = {
      components: {},
      path: this.compilePath(nested),
      redirect: this.route.redirect,
      children: children.map((child) => child.compile(true)),
      name: children.length ? undefined : this.compileName(),
      alias: children.length ? undefined : this.route.alias,
      meta: children.length ? undefined : this.route.meta,
      props: children.length ? undefined : this.route.props,
    }

    this.components(compiled)

    if (this.route.guards.size > 0) {
      this.beforeEnter(compiled)
    }

    return filterObject(compiled, (item) => {
      if (item instanceof Function) {
        return false
      }

      return item === undefined || item === '' || !Object.keys(item).length
    })
  }

  components(compiled) {
    for (const [name, component] of Object.entries(this.route.components)) {
      compiled.components[name] = component
    }
  }

  compilePath(nested) {
    const cleanedPath = trim([this.route.prefixClamp, this.route.path].join('/')) || (nested ? '/' : '')
    return nested ? cleanedPath : `/${cleanedPath}`
  }

  compileName() {
    const separator = Factory.nameSeparator
    const compiledName = [this.route.nameClamp, this.route.name].join(separator)

    return trim(compiledName, separator)
  }

  beforeEnter(compiled) {
    compiled.beforeEnter = (to, from, next) => {
      Array.from(this.route.guards)
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
