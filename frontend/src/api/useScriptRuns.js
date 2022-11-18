import { useAPI } from './apiClient'

const requestPath = () => '/api/script_runs'

const getterKey = (axiosOptions = undefined) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useScriptRuns = ({ axiosOptions, options }) => useAPI(getterKey(axiosOptions), options)
export default useScriptRuns
