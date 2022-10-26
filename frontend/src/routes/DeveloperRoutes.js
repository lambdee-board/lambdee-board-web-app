import {
  Outlet,
  Navigate
} from 'react-router-dom'

function DeveloperRoutes() {
  const role = localStorage.getItem('role')
  return (
    role === 'developer' ||
    role === 'manager' ||
    role === 'admin' ?
      <Outlet /> : <Navigate to='/' />
  )
}


export default DeveloperRoutes
