import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Workspace } from '../types'

interface WorkspacesResponse {
  workspaces: Workspace[]
  totalPages: number
}

interface WorkspacesArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateWorkspacesArgs {
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = '/api/workspaces'

const getterKey = (axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath, axiosOptions] as [string, AxiosRequestConfig]
  return requestPath
}

export const useWorkspaces = ({ axiosOptions, options }: WorkspacesArgs = {}) =>
  useAPI<WorkspacesResponse>(getterKey(axiosOptions), options)
export const mutateWorkspaces = ({ axiosOptions, data, options }: MutateWorkspacesArgs = {}) =>
  mutateAPI(getterKey(axiosOptions), data, options)
export default useWorkspaces
