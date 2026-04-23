import type { TaskPriority } from './task'

export interface SprintTaskSummary {
  id: number
  name: string
  priority: TaskPriority
  spentTime: number
  points: number
  addedAt: string
  completedAt: string | null
  startState: string
  state: string
}

export interface Sprint {
  id: number
  boardId: number
  name: string
  description: string
  startedAt: string
  expectedEndAt: string
  endedAt: string | null
  finalListName: string
  customData: Record<string, unknown>
  url: string
  tasks?: SprintTaskSummary[]
}
