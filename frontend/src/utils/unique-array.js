export const uniqueArray = (arr) => {
  const hashmap = {}
  return arr.filter((e) => {
    return !(hashmap[e] = e in hashmap)
  })
}

export const uniqueArrayFilter = (arr, filterFunc) => {
  const hashmap = {}
  return arr.filter((e) => {
    return !(hashmap[e] = e in hashmap) && filterFunc(e)
  })
}

export const uniqueArrayBy = (arr, byFunc) => {
  const hashmap = {}
  return arr.filter((e) => {
    const result = byFunc(e)
    return !(hashmap[result] = result in hashmap)
  })
}

export const uniqueArrayByFilter = (arr, byFunc, filterFunc) => {
  const hashmap = {}
  return arr.filter((e) => {
    const result = byFunc(e)
    return !(hashmap[result] = result in hashmap) && filterFunc(e)
  })
}
