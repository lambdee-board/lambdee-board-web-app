import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'
import type { Tag } from '../types'

interface BoardTagsArgs {
  id: number | string | undefined
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = (id: number | string) => `/api/boards/${id}/tags`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useBoardTags = ({ id, axiosOptions, options }: BoardTagsArgs) =>
  useAPI<Tag[]>(getterKey(id!, axiosOptions), options)
export default useBoardTags
