import { useAPI } from './apiClient'

const useWorkspace = (id, ...args)  => useAPI(`/api/workspaces/${id}`, ...args)
const mutateWorkspace = (id, ...args) => mutateWorkspace(`/api/workspaces/${id}`, ...args)
export default useWorkspace
export { useWorkspace, mutateWorkspace }
