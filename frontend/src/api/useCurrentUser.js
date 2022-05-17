import useUser from './useUser'

const useCurrentUser = (...args)  => useUser('current', ...args)
export default useCurrentUser
