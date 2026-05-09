import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'
import type { Comment } from '../types'
import type { User } from '../types'

interface CommentsArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = (id: number | string) => `/api/tasks/${id}/comments`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useComments = ({ id, axiosOptions, options }: CommentsArgs) =>
  useAPI<Array<Comment & { author: User }>>(getterKey(id, axiosOptions), options)
export default useComments
