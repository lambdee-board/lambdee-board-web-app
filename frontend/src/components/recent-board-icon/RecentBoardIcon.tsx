import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import WorkspaceIcon from '../WorkspaceIcon'

import './RecentBoardIcon.sass'

interface Props {
  name: string
  size: number
  colour: string
  iconSize: string
}

function RecentBoardIcon({ name, size, colour, iconSize }: Props) {
  return (
    <div className='RecentBoardIcon'>
      <WorkspaceIcon name={name} size={size} />
      <div className='RecentBoardIcon-recent'>
        <FontAwesomeIcon transform={{ size: parseFloat(iconSize) }} className='RecentBoardIcon-recent-icon' icon={faClipboardList} color={colour} />
      </div>
    </div>

  )
}

export default RecentBoardIcon
