import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'

interface ListTasksArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = (id: number | string) => `/api/lists/${id}/tasks`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useListTasks = ({ id, axiosOptions, options }: ListTasksArgs) =>
  useAPI(getterKey(id, axiosOptions), options)
export default useListTasks
