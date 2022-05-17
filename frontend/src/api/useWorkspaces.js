import { useAPI } from './apiClient'

const useWorkspaces = (limit, ...args)  => useAPI('/api/workspaces', { params: { limit } }, ...args)
export default useWorkspaces
