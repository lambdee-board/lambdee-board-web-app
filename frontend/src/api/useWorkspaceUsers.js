import { useAPI } from './apiClient'

const requestPath = (id) => `/api/workspaces/${id}/users`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}


export const useWorkspaceUsers = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useWorkspaceUsers
