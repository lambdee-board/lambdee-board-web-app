import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'

import {
  MenuItem,
  Skeleton
} from '@mui/material'

import useBoard from '../../api/board'

import RecentBoardIcon from '../RecentBoardIcon'
import DropdownButton from '../DropdownButton'

function RecentBoard({ boardId, boardName, boardColour, workspaceId, workspaceName, handleClose }) {
  const navigate = useNavigate()


  return (
    <MenuItem onClick={() => {
      localStorage.setItem('sidebarSelected', boardName)
      handleClose()
      navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
    }}>
      <RecentBoardIcon name={workspaceName} size={32} colour={boardColour} iconSize='20' />
      {workspaceName}/{boardName}
    </MenuItem>
  )
}

const RecentMenuButton = () => {
  const { data: boards, isLoading, isError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event) => setAnchorEl(event.currentTarget)

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
        <DropdownButton label='Recent' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
          {boards.map((recentBoard) => (
            <RecentBoard
              handleClose = {handleClose}
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
  boardColour: PropTypes.string.isRequired,
  handleClose: PropTypes.func
}

export default RecentMenuButton
