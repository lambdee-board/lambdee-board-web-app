export const takeUntil = (arr, fn) => {
  for (const [i, val] of arr.entries()) if (fn(val)) return arr.slice(0, i)
  return arr
}
