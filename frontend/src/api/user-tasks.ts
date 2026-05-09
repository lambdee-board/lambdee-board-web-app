import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Board } from '../types'

interface UserTasksArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateUserTasksArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/boards/${id}/user_tasks`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useUserTasks = ({ id, axiosOptions, options }: UserTasksArgs) =>
  useAPI<Board>(getterKey(id, axiosOptions), options)
export const mutateUserTasks = ({ id, axiosOptions, data, options }: MutateUserTasksArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useUserTasks
