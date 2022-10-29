import {
  Outlet,
  Navigate
} from 'react-router-dom'

function PublicRoutes() {
  return (
    localStorage.getItem('token') ? <Navigate to='/' /> : <Outlet />
  )
}


export default PublicRoutes
