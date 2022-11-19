import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/boards/${id}/active_sprint`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useBoardActiveSprint = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
const mutateBoardActiveSprint = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useBoardActiveSprint
export { useBoardActiveSprint, mutateBoardActiveSprint }
