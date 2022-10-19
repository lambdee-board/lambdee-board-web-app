import {
  Outlet,
  Navigate
} from 'react-router-dom'
import PropTypes from 'prop-types'

function PrivateRoutes() {
  return (
    localStorage.getItem('token') ? <Outlet /> : <Navigate to='/login' />
  )
}
PrivateRoutes.propTypes = {
  children: PropTypes.object,
  isAuthenticated: PropTypes.string,
}

export default PrivateRoutes
