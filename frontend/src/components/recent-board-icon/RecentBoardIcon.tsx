import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import WorkspaceIcon from '../WorkspaceIcon'


interface Props {
  name: string
  size: number
  color: string
  iconSize: string
}

function RecentBoardIcon({ name, size, color, iconSize }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <div style={{ width: '100%' }}>
        <WorkspaceIcon name={name} size={size} />
      </div>
      <div style={{ height: '50%', marginLeft: '-30%', marginTop: '40%' }}>
        <FontAwesomeIcon transform={{ size: parseFloat(iconSize) }} style={{ filter: 'drop-shadow(2px 4px 2px white)' }} icon={faClipboardList} color={color} />
      </div>
    </div>

  )
}

export default RecentBoardIcon
