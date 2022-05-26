import { useAPI } from './apiClient'

const useTask = (id)  => useAPI(`/api/tasks/${id}?include_associations=true`)
export default useTask
