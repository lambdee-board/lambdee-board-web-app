import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Workspace } from '../types'

interface WorkspaceArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig | null
  options?: SWRConfiguration
}

interface MutateWorkspaceArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/workspaces/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig | null) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useWorkspace = ({ id, axiosOptions, options }: WorkspaceArgs) =>
  useAPI<Workspace>(getterKey(id, axiosOptions), options)
export const mutateWorkspace = ({ id, axiosOptions, data, options }: MutateWorkspaceArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useWorkspace
