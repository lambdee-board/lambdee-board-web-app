export const uniqueArray = <T>(arr: T[]): T[] => {
  const hashmap: Record<string, boolean> = {}
  return arr.filter((e) => {
    return !(hashmap[String(e)] = String(e) in hashmap)
  })
}

export const uniqueArrayFilter = <T>(arr: T[], filterFunc: (e: T) => boolean): T[] => {
  const hashmap: Record<string, boolean> = {}
  return arr.filter((e) => {
    return !(hashmap[String(e)] = String(e) in hashmap) && filterFunc(e)
  })
}

export const uniqueArrayBy = <T>(arr: T[], byFunc: (e: T) => unknown): T[] => {
  const hashmap: Record<string, boolean> = {}
  return arr.filter((e) => {
    const result = String(byFunc(e))
    return !(hashmap[result] = result in hashmap)
  })
}

export const uniqueArrayByFilter = <T>(arr: T[], byFunc: (e: T) => unknown, filterFunc: (e: T) => boolean): T[] => {
  const hashmap: Record<string, boolean> = {}
  return arr.filter((e) => {
    const result = String(byFunc(e))
    return !(hashmap[result] = result in hashmap) && filterFunc(e)
  })
}
