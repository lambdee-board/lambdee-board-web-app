import {
  Outlet,
  Navigate
} from 'react-router-dom'

function RegularRoutes() {
  const role = localStorage.getItem('role')
  return (
    role === 'regular' ||
    role === 'developer' ||
    role === 'manager' ||
    role === 'admin' ?
      <Outlet /> : <Navigate to='/' />
  )
}


export default RegularRoutes
