import { useAPI, mutateAPI } from './api-client'

const requestPath = (id) => `/api/boards/${id}/sprints`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useBoardSprints = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)
const mutateBoardSprints = ({ id, axiosOptions, data, options }) => mutateAPI(getterKey(id, axiosOptions), data, options)

export default useBoardSprints
export { useBoardSprints, mutateBoardSprints }
