export class RouteBag {
  constructor() {
    this._routes = []
  }

  routes() {
    return this._routes
  }

  _pushRoute(route) {
    this._routes.push(route)
  }

  _compiled() {
    return this.routes().map((route) => route._compile())
  }
}
