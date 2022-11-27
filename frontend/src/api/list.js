import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/lists/${id}`

export const listGetterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

export const useList = ({ id, axiosOptions, options })  => useAPI(listGetterKey(id, axiosOptions), options)
export const mutateList = ({ id, axiosOptions, data, options }) => mutateAPI(listGetterKey(id, axiosOptions), data, options)

export default useList
