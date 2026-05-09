import { create } from 'zustand'

interface State {
  draggedTaskId: number | null
}

interface Actions {
  setDraggedTaskId: (taskId: string | number | null) => void
  clearDraggedTaskId: () => void
}

type Store = State & Actions

const useTaskDndStore = create<Store>((set) => ({
  draggedTaskId: null,
  setDraggedTaskId: (taskId) => set(() => ({
    draggedTaskId: taskId ? parseInt(String(taskId)) : null
  })),
  clearDraggedTaskId: () => set(() => ({
    draggedTaskId: null
  })),
}))

export default useTaskDndStore
