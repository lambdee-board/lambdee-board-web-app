import { useAPI } from './apiClient'

const useTask = (id, ...args)  => useAPI(`/api/tasks/${id}`, ...args)
export default useTask
