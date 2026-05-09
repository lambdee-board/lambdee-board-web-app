import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI, mutateAPI } from './api-hooks'
import type { User } from '../types'

interface UsersResponse {
  users: User[]
  totalPages: number
}

interface UsersArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

interface MutateUsersArgs {
  axiosOptions?: AxiosRequestConfig
  data?: unknown
  options?: boolean | object
}

const requestPath = '/api/users'

const getterKey = (axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath, axiosOptions] as [string, AxiosRequestConfig]
  return requestPath
}

export const useUsers = ({ axiosOptions, options }: UsersArgs = {}) =>
  useAPI<UsersResponse>(getterKey(axiosOptions), options)
export const mutateUsers = ({ axiosOptions, data, options }: MutateUsersArgs = {}) =>
  mutateAPI(getterKey(axiosOptions), data, options)
export default useUsers
