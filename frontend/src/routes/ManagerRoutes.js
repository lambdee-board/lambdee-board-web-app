import {
  Outlet,
  Navigate
} from 'react-router-dom'

function ManagerRoutes() {
  const role = localStorage.getItem('role')
  return (
    role === 'manager' ||
    role === 'admin' ?
      <Outlet /> : <Navigate to='/' />
  )
}


export default ManagerRoutes
