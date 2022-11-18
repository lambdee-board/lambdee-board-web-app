import { useAPI } from './apiClient'

const requestPath = (id) => `/api/scripts/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useScript = ({ id, axiosOptions, options }) => useAPI(getterKey(id, axiosOptions), options)
export default useScript
