import { useAPI } from './apiClient'

const useTasks = (...args)  => useAPI('/api/workspaces', ...args)
export default useTasks
