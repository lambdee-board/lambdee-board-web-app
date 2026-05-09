import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Sprint } from '../types'

interface BoardActiveSprintArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateBoardActiveSprintArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/boards/${id}/active_sprint`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useBoardActiveSprint = ({ id, axiosOptions, options }: BoardActiveSprintArgs) =>
  useAPI<Sprint>(getterKey(id, axiosOptions), options)
export const mutateBoardActiveSprint = ({ id, axiosOptions, data, options }: MutateBoardActiveSprintArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useBoardActiveSprint
