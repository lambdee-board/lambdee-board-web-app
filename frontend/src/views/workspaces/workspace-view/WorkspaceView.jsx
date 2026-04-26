import { Outlet } from 'react-router-dom'

import './WorkspaceView.sass'
import Sidebar from '../../../components/sidebar/Sidebar'

export default function WorkspaceView() {
  return (
    <div className='WorkspaceView'>
      <Sidebar />
      <div className='WorkspaceView-body'>
        <Outlet />
      </div>
    </div>
  )
}
