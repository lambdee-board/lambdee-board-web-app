import { useAPI, mutateAPI } from './apiClient'

const requestPath = (id) => `/api/lists/${id}`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useList = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
const mutateList = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useList
export { useList, mutateList }
