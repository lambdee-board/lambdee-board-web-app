import { useAPI } from './apiClient'

const useWorkspaceUsers = (id, ...args)  => useAPI(`/api/workspaces/${id}/users`, ...args)
export default useWorkspaceUsers
