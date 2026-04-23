export interface SprintTask {
  id: number
  taskId: number
  sprintId: number
  addedAt: string
  completedAt: string | null
  startState: string
  state: string
  customData: Record<string, unknown>
  url: string
}
