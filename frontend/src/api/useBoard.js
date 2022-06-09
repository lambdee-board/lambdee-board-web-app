import { useAPI, mutateAPI } from './apiClient'

const useBoard = (id, ...args)  => useAPI(`/api/boards/${id}`, ...args)
const mutateBoard = (id, ...args) => mutateAPI(`/api/boards/${id}`, ...args)

export default useBoard
export { useBoard, mutateBoard }
