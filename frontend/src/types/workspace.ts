import type { Board } from './board'

export interface Workspace {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  customData: Record<string, unknown>
  url: string
  boards?: Board[]
}
