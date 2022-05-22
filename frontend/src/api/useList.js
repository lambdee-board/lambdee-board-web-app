import { useAPI } from './apiClient'

const useList = (id, ...args)  => useAPI(`/api/lists/${id}`, ...args)
export default useList
