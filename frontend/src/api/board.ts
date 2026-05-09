import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { Board } from '../types'

interface BoardArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateBoardArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/boards/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useBoard = ({ id, axiosOptions, options }: BoardArgs) =>
  useAPI<Board>(getterKey(id, axiosOptions), options)
export const mutateBoard = ({ id, axiosOptions, data, options }: MutateBoardArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useBoard
