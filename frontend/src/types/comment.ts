import type { User } from './user'

export interface Comment {
  id: number
  body: string
  deletedAt: string | null
  authorId: number
  taskId: number
  createdAt: string
  updatedAt: string
  customData: Record<string, unknown>
  url: string
  author?: User
}
