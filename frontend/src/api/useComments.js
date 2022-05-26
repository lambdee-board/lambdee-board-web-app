import { useAPI } from './apiClient'

const useComments = (id, ...args)  => useAPI(`/api/tasks/${id}/comments`, ...args)
export default useComments
