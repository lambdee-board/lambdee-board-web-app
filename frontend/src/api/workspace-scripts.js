import { useAPI } from './api-client'

const requestPath = () => '/api/scripts'

const getterKey = (axiosOptions = undefined) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useWorkspaceScripts = ({ axiosOptions, options }) => useAPI(getterKey(axiosOptions), options)
export default useWorkspaceScripts
