export const takeUntil = <T>(arr: T[], fn: (val: T) => boolean): T[] => {
  for (const [i, val] of arr.entries()) if (fn(val)) return arr.slice(0, i)
  return arr
}
