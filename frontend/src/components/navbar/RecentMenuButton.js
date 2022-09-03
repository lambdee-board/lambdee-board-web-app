import React from 'react'
import {
  MenuItem,
  Skeleton
} from '@mui/material'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'

import RecentBoardIcon from '../RecentBoardIcon'
import DropdownButton from '../DropdownButton'
import useWorkspace from '../../api/useWorkspace'
import useBoard from '../../api/useBoard'

function RecentBoard({ boardId, boardName, boardColour, workspaceId }) {
  const navigate = useNavigate()
  const { data: workspace } = useWorkspace({ id: workspaceId, axiosOptions: null })

  return (
    <MenuItem onClick={() => navigate(`/workspaces/${workspaceId}/boards/${boardId}`)}>
      <RecentBoardIcon name={workspace.name} size={32} colour={boardColour} iconSize='20' />
      {workspace.name}/{boardName}
    </MenuItem>
  )
}

const RecentMenuButton = () => {
  const { data: board, isLoading, isError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })

  const navigate = useNavigate()
  // isLoading = true

  if (isLoading || isError) return (
    <DropdownButton label='Recent'>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
    </DropdownButton>
  )

  return (
    <div>
      {typeof board !== 'undefined' && board.length > 0 &&
      <DropdownButton label='Recent'>
        {board.map((recentBoard) => (
          <RecentBoard key={recentBoard.id} boardId={recentBoard.id} boardName={recentBoard.name} boardColour={recentBoard.colour} workspaceId={recentBoard.workspaceId} />
        ))}
      </DropdownButton>
      }
    </div>

  )
}

RecentBoard.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardName: PropTypes.string.isRequired,
  workspaceId: PropTypes.number.isRequired,
  boardColour: PropTypes.string.isRequired
}

export default RecentMenuButton
