import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { TaskWithAssociations } from '../types'

interface TaskArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateTaskArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/tasks/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useTask = ({ id, axiosOptions, options }: TaskArgs) =>
  useAPI<TaskWithAssociations>(getterKey(id, axiosOptions), options)
export const mutateTask = ({ id, axiosOptions, data, options }: MutateTaskArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useTask
