export function cleanRouteParam(string) {
  return string
    .replace(/\}\{/, '}/{')
    .replace(/\{all\}/, '(.*)')
    .replace(/\(number\)/, '(\\d+)')
    .replace(/\(string\)/, '(\\w+)')
    .replace(/\{(\w+)\}/, ':$1')
    .trim()
}
