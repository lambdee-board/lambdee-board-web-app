import { useAPI } from './api-client'

const requestPath = (id) => `/api/users/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useUser = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useUser
