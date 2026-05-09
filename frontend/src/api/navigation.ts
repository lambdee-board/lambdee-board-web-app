type NavigateFn = (path: string) => void

let navigateFn: NavigateFn | null = null

export const setNavigate = (fn: NavigateFn) => { navigateFn = fn }
export const navigateTo = (path: string) => navigateFn?.(path)
