export function cleanRouteParam(string) {
  return string
    .replace(/\}\{/, '}/{')
    .replace(/\{all\}/, '(.*)')
    .replace(/\{(\w+)\}/, ':$1')
    .trim()
}
