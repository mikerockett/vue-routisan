export function filterObject(object, predicate) {
  let key
  let filteredObject = {}

  for (key in object) {
    if (object.hasOwnProperty(key) && !predicate(object[key])) {
      filteredObject[key] = object[key]
    }
  }

  return filteredObject
}
