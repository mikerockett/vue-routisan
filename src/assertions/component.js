import { typeAssertionError } from '../errors/type-assertion-error'

export function assertComponent(instance, context) {
  if (instance instanceof Object && instance.hasOwnProperty('staticRenderFns') && instance.hasOwnProperty('compiled')) {
    return instance
  }

  throw typeAssertionError(context, 'Vue Component')
}
