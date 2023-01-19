import { useAPI, mutateAPI } from './api-client'

const requestPath = (scope, id) => `/api/${scope}/${id}/ui_script_triggers`

const getterKey = (scope, id, axiosOptions = undefined) => {
  let key = requestPath(scope, id)
  if (axiosOptions != null) key = [key, axiosOptions]
  return key
}

const useScriptTriggers = ({ scope, id, axiosOptions, options })  => useAPI(getterKey(scope, id, axiosOptions), options)
const mutateScriptTriggers = ({ scope, id, axiosOptions, data, options }) => mutateAPI(getterKey(scope, id, axiosOptions), data, options)

export default useScriptTriggers
export { useScriptTriggers, mutateScriptTriggers }
