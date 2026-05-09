import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Script } from '../types'

interface WorkspaceScriptsResponse {
  scripts: Script[]
  totalPages: number
}

interface WorkspaceScriptsArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateWorkspaceScriptsArgs {
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = '/api/scripts'

const getterKey = (axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath, axiosOptions] as [string, AxiosRequestConfig]
  return requestPath
}

export const useWorkspaceScripts = ({ axiosOptions, options }: WorkspaceScriptsArgs) =>
  useAPI<WorkspaceScriptsResponse>(getterKey(axiosOptions), options)
export const mutateWorkspaceScripts = ({ axiosOptions, data, options }: MutateWorkspaceScriptsArgs) =>
  mutateAPI(getterKey(axiosOptions), data, options)
export default useWorkspaceScripts
