export function typeAssertionError(context, expected) {
  return new Error(`TypeError: ${context} must be of type ${expected}`)
}
