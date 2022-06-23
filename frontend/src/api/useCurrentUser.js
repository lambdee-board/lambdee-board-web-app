import useUser from './useUser'

const useCurrentUser = (args)  => useUser({ id: 'current', ...args })
export default useCurrentUser
