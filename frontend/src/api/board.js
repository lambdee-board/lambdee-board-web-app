import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/boards/${id}`

export const boardGetterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useBoard = ({ id, axiosOptions, options })  => useAPI(boardGetterKey(id, axiosOptions), options)
export const mutateBoard = ({ id, axiosOptions, data, options }) => mutateAPI(boardGetterKey(id, axiosOptions), data, options)

export default useBoard
