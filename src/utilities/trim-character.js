export function trim(input, mask = '/') {
  while (~mask.indexOf(input[0])) input = input.slice(1)
  while (~mask.indexOf(input[input.length - 1])) input = input.slice(0, -1)

  return input
}
