import { useAPI } from './apiClient'

const requestPath = (id) => `/api/sprints/${id}/burn_up_chart`

const getterKey = (id, axiosOptions = undefined) => {
  let key = requestPath(id)
  if (axiosOptions != null) key = [key, axiosOptions]

  return key
}

const useSprintChart = ({ id, axiosOptions, options })  => useAPI(getterKey(id, axiosOptions), options)

export default useSprintChart

