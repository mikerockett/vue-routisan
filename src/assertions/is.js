import { typeAssertionError } from '../errors/type-assertion-error'

export function assertIs(instance, context, type, typeName) {
  if (!(instance instanceof type)) {
    throw typeAssertionError(context, typeName)
  }

  return instance
}
