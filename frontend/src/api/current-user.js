import useUser from './user'

const useCurrentUser = (args)  => useUser({ id: 'current', ...args })
export default useCurrentUser
