import { useAPI } from './apiClient'

const requestPath = '/api/users'

const getterKey = (axiosOptions) => {
  let key = requestPath
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useUsers = ({ axiosOptions, options })  => useAPI(getterKey(axiosOptions), options)
export default useUsers
