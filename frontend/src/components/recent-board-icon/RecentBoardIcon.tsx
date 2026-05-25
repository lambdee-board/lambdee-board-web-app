import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@mui/material'

import WorkspaceIcon from '../WorkspaceIcon'


interface Props {
  name: string
  size: number
  color: string
  iconSize: string
}

function RecentBoardIcon({ name, size, color, iconSize }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <Box sx={{ width: '100%' }}>
        <WorkspaceIcon name={name} size={size} />
      </Box>
      <Box sx={{ height: '50%', marginLeft: '-30%', marginTop: '40%' }}>
        <FontAwesomeIcon transform={{ size: parseFloat(iconSize) }} style={{ filter: 'drop-shadow(2px 4px 2px white)' }} icon={faClipboardList} color={color} />
      </Box>
    </Box>

  )
}

export default RecentBoardIcon
