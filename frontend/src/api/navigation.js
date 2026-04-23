let navigateFn = null

export const setNavigate = (fn) => { navigateFn = fn }
export const navigateTo = (path) => navigateFn?.(path)
