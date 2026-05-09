import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { UiScriptTrigger } from '../types'

interface ScriptTriggersArgs {
  scope: string
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateScriptTriggersArgs {
  scope: string
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (scope: string, id: number | string) =>
  `/api/${scope}/${id}/ui_script_triggers`

const getterKey = (scope: string, id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(scope, id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(scope, id)
}

export const useScriptTriggers = ({ scope, id, axiosOptions, options }: ScriptTriggersArgs) =>
  useAPI<UiScriptTrigger[]>(getterKey(scope, id, axiosOptions), options)
export const mutateScriptTriggers = ({ scope, id, axiosOptions, data, options }: MutateScriptTriggersArgs) =>
  mutateAPI(getterKey(scope, id, axiosOptions), data, options)
export default useScriptTriggers
