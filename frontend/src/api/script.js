import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/scripts/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useScript = ({ id, axiosOptions, options }) => useAPI(getterKey(id, axiosOptions), options)
export const mutateScript = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)
export default useScript
