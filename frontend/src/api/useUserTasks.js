import { useAPI, mutateAPI } from './apiClient'

const requestPath = (id) => `/api/boards/${id}/user_tasks`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useUserTasks = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
const mutateUserTasks = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useUserTasks
export { useUserTasks, mutateUserTasks }
