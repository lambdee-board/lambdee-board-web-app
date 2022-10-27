import {
  Outlet,
  Navigate
} from 'react-router-dom'
import { isManager } from '../permissions/ManagerContent'

function ManagerRoutes() {
  return (
    isManager ?
      <Outlet /> : <Navigate to='/' />
  )
}

export default ManagerRoutes
