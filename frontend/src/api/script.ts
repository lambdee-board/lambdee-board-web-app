import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Script } from '../types'

interface ScriptArgs {
  id: number | string | undefined
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateScriptArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/scripts/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useScript = ({ id, axiosOptions, options }: ScriptArgs) =>
  useAPI<Script>(getterKey(id!, axiosOptions), options)
export const mutateScript = ({ id, axiosOptions, data, options }: MutateScriptArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useScript
