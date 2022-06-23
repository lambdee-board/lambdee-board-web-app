import { useAPI, mutateAPI } from './apiClient'

const requestPath = '/api/users'

const getterKey = (axiosOptions) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useUsers = ({ axiosOptions, options } = {})  => useAPI(getterKey(axiosOptions), options)
export const mutateUsers = ({ axiosOptions, data, options } = {})  => mutateAPI(getterKey(axiosOptions), data, options)
export default useUsers
