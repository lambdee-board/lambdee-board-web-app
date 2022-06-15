import { useAPI } from './apiClient'

const useBoardTags = (id, ...args)  => useAPI(`/api/boards/${id}/tags`, ...args)

export default useBoardTags
