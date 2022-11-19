import { Outlet, Navigate } from 'react-router-dom'
import { isDeveloper } from '../../internal/permissions'

export function DeveloperRoutes() {
  return (
    isDeveloper() ?
      <Outlet /> : <Navigate to='/' />
  )
}

export default DeveloperRoutes
