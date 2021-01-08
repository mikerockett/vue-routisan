import { typeAssertionError } from '../errors/type-assertion-error'

export function assertString(instance, context) {
  if (!instance instanceof String || typeof instance !== 'string') {
    throw typeAssertionError(context, 'String')
  }

  return instance
}
