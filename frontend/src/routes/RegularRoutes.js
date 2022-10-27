import {
  Outlet,
  Navigate
} from 'react-router-dom'
import { isRegular } from '../permissions/RegularContent'

function RegularRoutes() {
  return (
    isRegular ?
      <Outlet /> : <Navigate to='/' />
  )
}

export default RegularRoutes
