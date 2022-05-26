import { useAPI, mutateAPI } from './apiClient'

const useList = (id, ...args)  => useAPI(`/api/lists/${id}`, ...args)
const mutateList = (id, ...args) => mutateAPI(`/api/lists/${id}`, ...args)

export default useList
export { useList, mutateList }
