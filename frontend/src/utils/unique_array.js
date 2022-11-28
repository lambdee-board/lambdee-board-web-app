export const uniqueArray = (arr) => uniqueArrayBy(arr, (e) => e)

export const uniqueArrayBy = (arr, func) => {
  const hashmap = {}
  return arr.filter((e) => {
    const result = func(e)
    return !(hashmap[result] = result in hashmap)
  })
}
