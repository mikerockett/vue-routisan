export function typeAssertionError(context, expected) {
  return new TypeError(`${context} must be of type ${expected}`)
}
