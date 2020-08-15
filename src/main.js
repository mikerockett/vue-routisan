import { Route } from './route/route'

export function route() {
  return Route.view(...arguments)
}

export function redirect() {
  return Route.redirect(...arguments)
}

export function fallback() {
  return Route.fallback(...arguments)
}

export function group() {
  return Route.group(...arguments)
}

export { Factory } from './route/factory'
export { Guard } from './guard'
export { Route }
