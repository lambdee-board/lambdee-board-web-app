import {
  Outlet,
  Navigate
} from 'react-router-dom'
import PropTypes from 'prop-types'

function PublicRoutes() {
  return (
    !localStorage.getItem('token') ? <Outlet /> : <Navigate to='/' />
  )
}
PublicRoutes.propTypes = {
  children: PropTypes.object,
  isAuthenticated: PropTypes.string,
}

export default PublicRoutes
