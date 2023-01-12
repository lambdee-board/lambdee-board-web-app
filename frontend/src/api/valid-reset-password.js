import useUser from './user'

const useValidResetPassword = (args)  => useUser({ id: 'valid_reset_password', ...args })
export default useValidResetPassword
