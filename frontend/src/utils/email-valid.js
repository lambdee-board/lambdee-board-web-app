export const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailValid(email) {
  return emailRegexp.test(email)
}
