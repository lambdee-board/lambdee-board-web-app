import {
  Outlet,
  Navigate
} from 'react-router-dom'

export function PublicRoutes() {
  return (
    localStorage.getItem('token') ? <Navigate to='/' /> : <Outlet />
  )
}

export default PublicRoutes
