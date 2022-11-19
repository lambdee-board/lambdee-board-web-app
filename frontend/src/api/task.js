import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/tasks/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useTask = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
const mutateTask = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useTask
export { useTask, mutateTask }
