import { useAPI } from './apiClient'

const useTaskLists = (id, tasks, ...args)  => useAPI(`/api/boards/${id}`, { params: { tasks } }, ...args)
export default useTaskLists
