import type { User } from './user'
import type { Tag } from './tag'
import type { List } from './list'

export type TaskPriority = 'very_low' | 'low' | 'medium' | 'high' | 'very_high'

export interface TaskShort {
  id: number
  name: string
  pos: number
  priority: TaskPriority
  spentTime: number
  points: number
  dueTime: string | null
  listId: number
  deletedAt: string | null
  url: string
  listUrl: string
}

export interface Task extends TaskShort {
  description: string
  createdAt: string
  updatedAt: string
}

export interface TaskWithAssociations extends Task {
  list: List
  author: User
  users: User[]
  tags: Tag[]
}
