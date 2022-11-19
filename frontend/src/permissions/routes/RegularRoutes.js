import {
  Outlet,
  Navigate
} from 'react-router-dom'

import { isRegular } from '../../internal/permissions'

export function RegularRoutes() {
  return (
    isRegular() ?
      <Outlet /> : <Navigate to='/' />
  )
}

export default RegularRoutes
