export type UserRole = 'guest' | 'regular' | 'developer' | 'manager' | 'admin'

export interface UserShort {
  id: number
  name: string
  avatarUrl: string
  role: UserRole
  url: string
}

export interface User extends UserShort {
  email: string
  createdAt: string
  updatedAt: string
  customData: Record<string, unknown>
}
