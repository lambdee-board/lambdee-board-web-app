import { useAPI, mutateAPI } from './api-client'

const requestPath = '/api/scripts'

const getterKey = (axiosOptions) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useWorkspaceScripts = ({ axiosOptions, options }) => useAPI(getterKey(axiosOptions), options)
export const mutateWorkspaceScripts = ({ axiosOptions, data, options }) => mutateAPI(getterKey(axiosOptions), data, options)
export default useWorkspaceScripts
