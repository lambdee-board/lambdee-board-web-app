import {
  Outlet,
  Navigate
} from 'react-router-dom'

function PrivateRoutes() {
  return (
    localStorage.getItem('token') ? <Outlet /> : <Navigate to='/login' />
  )
}


export default PrivateRoutes
