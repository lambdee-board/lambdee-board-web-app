import { useAPI } from './apiClient'

const useWorkspace = (id, ...args)  => useAPI(`/api/workspaces/${id}`, ...args)
export default useWorkspace
