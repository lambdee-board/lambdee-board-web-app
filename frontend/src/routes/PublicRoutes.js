import {
  Outlet,
  Navigate
} from 'react-router-dom'

function PublicRoutes() {
  return (
    !localStorage.getItem('token') ? <Outlet /> : <Navigate to='/' />
  )
}


export default PublicRoutes
