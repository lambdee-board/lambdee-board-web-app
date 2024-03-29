import { useAPI } from './api-client'

const requestPath = (id) => `/api/lists/${id}/tasks`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useListTasks = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useListTasks
