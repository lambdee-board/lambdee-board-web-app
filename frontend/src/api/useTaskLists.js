import { useAPI } from './apiClient'

const useTaskLists = (...args)  => useAPI('/api/workspaces', ...args)
export default useTaskLists
