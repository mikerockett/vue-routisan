export class RouteBag {
  constructor() {
    this.routes = []
  }

  pushRoute(route) {
    this.routes.push(route)
  }

  compiled() {
    return this.routes.map((route) => route.compile())
  }
}
