import { useAPI, mutateAPI } from './apiClient'

const requestPath = '/api/workspaces'

const getterKey = (limit) => {
  let key = requestPath
  if (limit != null) key = [key, { params: { limit } }]

  return key
}

export const useWorkspaces = ({ limit, options })  => useAPI(getterKey(limit), options)
export const mutateWorkspaces =  ({ limit, data, options }) => mutateAPI(getterKey(limit), data, options)

export default useWorkspaces
