import React from 'react'
import {
  MenuItem,
  Skeleton
} from '@mui/material'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'

import RecentBoardIcon from '../RecentBoardIcon'
import DropdownButton from '../DropdownButton'
import useBoard from '../../api/useBoard'

function RecentBoard({ boardId, boardName, boardColour, workspaceId, workspaceName }) {
  const navigate = useNavigate()

  return (
    <MenuItem onClick={() => navigate(`/workspaces/${workspaceId}/boards/${boardId}`)}>
      <RecentBoardIcon name={workspaceName} size={32} colour={boardColour} iconSize='20' />
      {workspaceName}/{boardName}
    </MenuItem>
  )
}

const RecentMenuButton = () => {
  const { data: boards, isLoading, isError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })

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
      {boards?.length > 0 &&
        <DropdownButton label='Recent'>
          {boards.map((recentBoard) => (
            <RecentBoard
              key={recentBoard.id}
              boardId={recentBoard.id}
              boardName={recentBoard.name}
              boardColour={recentBoard.colour}
              workspaceId={recentBoard.workspaceId}
              workspaceName={recentBoard.workspaceName}
            />
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
  workspaceName: PropTypes.string.isRequired,
  boardColour: PropTypes.string.isRequired
}

export default RecentMenuButton
