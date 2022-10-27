import {
  Outlet,
  Navigate
} from 'react-router-dom'
import { isDeveloper } from '../permissions/DeveloperContent'


function DeveloperRoutes() {
  return (
    isDeveloper() ?
      <Outlet /> : <Navigate to='/' />
  )
}


export default DeveloperRoutes
