import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import WorkspaceIcon from '../WorkspaceIcon'

import './RecentBoardIcon.sass'

interface Props {
  name: string
  size: number
  color: string
  iconSize: string
}

function RecentBoardIcon({ name, size, color, iconSize }: Props) {
  return (
    <div className='RecentBoardIcon'>
      <WorkspaceIcon name={name} size={size} />
      <div className='RecentBoardIcon-recent'>
        <FontAwesomeIcon transform={{ size: parseFloat(iconSize) }} className='RecentBoardIcon-recent-icon' icon={faClipboardList} color={color} />
      </div>
    </div>

  )
}

export default RecentBoardIcon
