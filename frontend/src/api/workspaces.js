import { useAPI, mutateAPI } from './api-client'

const requestPath = '/api/workspaces'

const getterKey = (axiosOptions = undefined) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useWorkspaces = ({ axiosOptions, options } = {})  => useAPI(getterKey(axiosOptions), options)
export const mutateWorkspaces =  ({ axiosOptions, data, options } = {}) => mutateAPI(getterKey(axiosOptions), data, options)

export default useWorkspaces
