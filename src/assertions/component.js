import { typeAssertionError } from '../errors/type-assertion-error'

export function assertComponent(instance, context) {
  if (!(instance instanceof Object) || !instance.hasOwnProperty('staticRenderFns') || !instance.hasOwnProperty('_compiled')) {
    throw typeAssertionError(context, 'Vue')
  }

  return instance
}
