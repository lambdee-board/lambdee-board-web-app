import create from 'zustand'

const useTaskDndStore = create((set, get) => ({
  draggedTaskId: null,
  setDraggedTaskId: (taskId) => set(() => ({
    draggedTaskId: taskId ? parseInt(taskId) : taskId
  })),
  clearDraggedTaskId: () => set(() => ({
    draggedTaskId: null
  })),
}))

export default useTaskDndStore
