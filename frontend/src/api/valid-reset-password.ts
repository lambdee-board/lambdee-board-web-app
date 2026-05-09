import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import useUser from './user'

interface ValidResetPasswordArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const useValidResetPassword = (args?: ValidResetPasswordArgs) =>
  useUser({ id: 'valid_reset_password', ...args })
export default useValidResetPassword
