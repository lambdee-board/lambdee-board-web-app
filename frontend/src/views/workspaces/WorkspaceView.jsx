import { Outlet } from 'react-router-dom'

import './WorkspaceView.sass'
import Sidebar from '../../components/Sidebar'

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
