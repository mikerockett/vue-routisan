import { typeAssertionError } from '../errors/type-assertion-error'
import { Guard } from '../guard'

export function assertGuard(instance, context) {
  if (!(instance instanceof Guard)) throw typeAssertionError(context, 'Guard')

  return instance
}
