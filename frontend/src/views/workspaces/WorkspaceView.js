import { Outlet } from 'react-router-dom'

import './WorkspaceView.sass'
import Sidebar from './../../components/Sidebar'

const getColor = () => {
  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  return colors[Math.floor(Math.random() * colors.length)]
}

const workspaceName = 'SnippetzDev'
const boardNameColor = [['Board 1', getColor()], ['Board 2', getColor()]]
const activeTab = 'Board 1'

export default function WorkspaceView() {
  return (
    <div className='WorkspaceView'>
      <Sidebar workspaceName={workspaceName} boardNameColor={boardNameColor} activeTab={activeTab} />
      <div className='WorkspaceView-body'>
        <Outlet />
      </div>
    </div>
  )
}
