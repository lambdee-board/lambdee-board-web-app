export const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailValid(email: string): boolean {
  return emailRegexp.test(email)
}
