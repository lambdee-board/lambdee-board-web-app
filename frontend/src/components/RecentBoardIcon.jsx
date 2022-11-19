
import PropTypes from 'prop-types'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import WorkspaceIcon from './WorkspaceIcon'

import './RecentBoardIcon.sass'

function RecentBoardIcon({ name, size, colour, iconSize }) {
  return (
    <div className='RecentBoardIcon'>
      <WorkspaceIcon className='RecentBoardIcon-workspace' name={name} size={size} />
      <div className='RecentBoardIcon-recent'>
        <FontAwesomeIcon transform={{ size: iconSize }} className='RecentBoardIcon-recent-icon' icon={faClipboardList} color={colour} />
      </div>
    </div>

  )
}

RecentBoardIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  colour: PropTypes.string.isRequired,
  iconSize: PropTypes.string.isRequired
}

export default RecentBoardIcon
