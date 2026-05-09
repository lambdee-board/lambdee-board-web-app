import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { UserShort } from '../types'

interface WorkspaceUsersResponse {
  users: UserShort[]
}

interface WorkspaceUsersArgs {
  id: number | string | undefined
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateWorkspaceUsersArgs {
  id: number | string | undefined
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/workspaces/${id}/users`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useWorkspaceUsers = ({ id, axiosOptions, options }: WorkspaceUsersArgs) =>
  useAPI<WorkspaceUsersResponse>(getterKey(id!, axiosOptions), options)
export const mutateWorkspaceUsers = ({ id, axiosOptions, data, options }: MutateWorkspaceUsersArgs) =>
  mutateAPI(getterKey(id!, axiosOptions), data, options)
export default useWorkspaceUsers
