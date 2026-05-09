import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { List } from '../types'

interface ListArgs {
  id: number | string | undefined
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateListArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = (id: number | string) => `/api/lists/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useList = ({ id, axiosOptions, options }: ListArgs) =>
  useAPI<List>(getterKey(id!, axiosOptions), options)
export const mutateList = ({ id, axiosOptions, data, options }: MutateListArgs) =>
  mutateAPI(getterKey(id, axiosOptions), data, options)
export default useList
