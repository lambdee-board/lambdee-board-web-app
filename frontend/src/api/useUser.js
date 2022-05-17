import { useAPI } from './apiClient'

const useUser = (id, ...args)  => useAPI(`/api/users/${id}`, ...args)
export default useUser
