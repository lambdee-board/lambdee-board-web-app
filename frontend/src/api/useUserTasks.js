import { useAPI } from './apiClient'

const requestPath = (id) => `/api/boards/${id}/user_tasks`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useUserTasks = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export default useUserTasks
