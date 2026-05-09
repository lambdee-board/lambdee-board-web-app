import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'

interface ScriptVariable {
  name: string
  description: string
  createdAt: string | null
}

interface ScriptVariablesResponse {
  scriptVariables: ScriptVariable[]
  totalPages: number
}

interface ScriptVariablesArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateScriptVariablesArgs {
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = '/api/script_variables'

const getterKey = (axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath, axiosOptions] as [string, AxiosRequestConfig]
  return requestPath
}

export const useScriptVariables = ({ axiosOptions, options }: ScriptVariablesArgs = {}) =>
  useAPI<ScriptVariablesResponse>(getterKey(axiosOptions), options)
export const mutateScriptVariables = ({ axiosOptions, data, options }: MutateScriptVariablesArgs = {}) =>
  mutateAPI(getterKey(axiosOptions), data, options)
export default useScriptVariables
