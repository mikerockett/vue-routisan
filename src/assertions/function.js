import { typeAssertionError } from '../errors/type-assertion-error'

export function assertFunction(instance, context) {
  if (!(instance instanceof Function)) {
    throw typeAssertionError(context, 'Function')
  }

  return instance
}
