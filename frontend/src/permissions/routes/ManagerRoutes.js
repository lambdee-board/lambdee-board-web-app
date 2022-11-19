import {
  Outlet,
  Navigate
} from 'react-router-dom'

import { isManager } from '../../internal/permissions'

export function ManagerRoutes() {
  return (
    isManager() ?
      <Outlet /> : <Navigate to='/' />
  )
}

export default ManagerRoutes
