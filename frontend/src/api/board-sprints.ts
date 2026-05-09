import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Sprint } from '../types'

interface BoardSprintsResponse {
  sprints: Sprint[]
  totalPages: number
}

interface BoardSprintsArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateBoardSprintsArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/boards/${id}/sprints`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useBoardSprints = ({ id, axiosOptions, options }: BoardSprintsArgs) =>
  useAPI<BoardSprintsResponse>(getterKey(id, axiosOptions), options)
export const mutateBoardSprints = ({ id, axiosOptions, data, options }: MutateBoardSprintsArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useBoardSprints
