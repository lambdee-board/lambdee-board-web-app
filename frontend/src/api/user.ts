import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'
import type { User } from '../types'

interface UserArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = (id: number | string) => `/api/users/${id}`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useUser = ({ id, axiosOptions, options }: UserArgs) =>
  useAPI<User>(getterKey(id, axiosOptions), options)
export default useUser
