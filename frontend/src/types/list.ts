import type { TaskShort } from './task'
import type { UserShort } from './user'
import type { TagShort } from './tag'

export interface ListTask extends TaskShort {
  users: UserShort[]
  tags: TagShort[]
}

export interface List {
  id: number
  name: string
  pos: number
  visible: boolean
  deletedAt: string | null
  boardId: number
  createdAt: string
  updatedAt: string
  customData: Record<string, unknown>
  url: string
  boardUrl: string
  tasks?: ListTask[]
}
