import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import useUser from './user'

interface CurrentUserArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const useCurrentUser = (args?: CurrentUserArgs) => useUser({ id: 'current', ...args })
export default useCurrentUser
