import { useAPI } from './apiClient'

const requestPath = (id) => `/api/lists/${id}/tasks`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useWorkspaceScripts = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useWorkspaceScripts
