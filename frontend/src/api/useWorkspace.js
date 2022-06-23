import { useAPI, mutateAPI } from './apiClient'

const requestPath = (id) => `/api/workspaces/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useWorkspace = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export const mutateWorkspace =  ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useWorkspace
