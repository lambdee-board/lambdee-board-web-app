import { useAPI } from './apiClient'

const useUsers = (...args)  => useAPI('/api/users', ...args)
export default useUsers
