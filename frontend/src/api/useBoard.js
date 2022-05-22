import { useAPI } from './apiClient'

const useBoard = (id, ...args)  => useAPI(`/api/boards/${id}`, ...args)
export default useBoard
