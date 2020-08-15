import { typeAssertionError } from '../errors/type-assertion-error'

export function assertObject(instance, context) {
  if (!(instance instanceof Object)) {
    throw typeAssertionError(context, 'Object')
  }

  return instance
}
