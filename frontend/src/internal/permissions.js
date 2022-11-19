const DEVELOPER_ROLES = new Set(['developer', 'manager', 'admin'])
const MANAGER_ROLES = new Set(['manager', 'admin'])
const REGULAR_ROLES = new Set(['regular', 'developer', 'manager', 'admin'])

export const isDeveloper = () => DEVELOPER_ROLES.has(localStorage.getItem('role'))
export const isManager = () => MANAGER_ROLES.has(localStorage.getItem('role'))
export const isRegular = () => REGULAR_ROLES.has(localStorage.getItem('role'))
