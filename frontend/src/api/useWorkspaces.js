import { useAPI } from './apiClient'

const requestPath = '/api/workspaces'

const getterKey = (axiosOptions) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useWorkspaces = ({ limit, options })  => useAPI(getterKey({ params: { limit } }), options)
export default useWorkspaces
