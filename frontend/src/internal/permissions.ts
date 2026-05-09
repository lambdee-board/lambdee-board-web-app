import type { UserRole } from '../types'

const DEVELOPER_ROLES = new Set<UserRole>(['developer', 'manager', 'admin'])
const MANAGER_ROLES = new Set<UserRole>(['manager', 'admin'])
const REGULAR_ROLES = new Set<UserRole>(['regular', 'developer', 'manager', 'admin'])

export const isDeveloper = (): boolean => DEVELOPER_ROLES.has(localStorage.getItem('role') as UserRole)
export const isManager = (): boolean => MANAGER_ROLES.has(localStorage.getItem('role') as UserRole)
export const isRegular = (): boolean => REGULAR_ROLES.has(localStorage.getItem('role') as UserRole)
