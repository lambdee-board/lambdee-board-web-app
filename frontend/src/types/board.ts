import type { List } from './list'

export interface Board {
  id: number
  name: string
  colour: string
  workspaceId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  customData: Record<string, unknown>
  url: string
  workspaceUrl?: string
  lists?: List[]
}
