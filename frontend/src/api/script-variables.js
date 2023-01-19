import { useAPI, mutateAPI } from './api-client'

const requestPath = '/api/script_variables'

const getterKey = (axiosOptions) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useScriptVariables = ({ axiosOptions, options } = {}) => useAPI(getterKey(axiosOptions), options)
export const mutateScriptVariables = ({ axiosOptions, data, options } = {}) => mutateAPI(getterKey(axiosOptions), data, options)
export default useScriptVariables
