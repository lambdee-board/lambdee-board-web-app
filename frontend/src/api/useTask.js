import { useAPI } from './apiClient'

const requestPath = (id) => `/api/tasks/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useTask = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useTask
