import { useAPI, mutateAPI } from './apiClient'

const requestPath = (id) => `/api/boards/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useBoard = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
export const mutateBoard = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useBoard
