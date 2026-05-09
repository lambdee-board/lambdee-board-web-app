import React from 'react'
import { useNavigate } from 'react-router'

import { MenuItem } from '@mui/material'

import useBoard from '../../../api/board'

import RecentBoardIcon from '../../recent-board-icon/RecentBoardIcon'
import DropdownButton from '../../dropdown-button/DropdownButton'
import RecentMenuButtonSkeleton from './RecentMenuButtonSkeleton'

interface RecentBoardProps {
  boardId: number
  boardName: string
  boardColour: string
  workspaceId: number
  workspaceName: string
  handleClose?: () => void
}

function RecentBoard({ boardId, boardName, boardColour, workspaceId, workspaceName, handleClose }: RecentBoardProps) {
  const navigate = useNavigate()

  return (
    <MenuItem onClick={() => {
      localStorage.setItem('sidebarSelected', boardName)
      handleClose?.()
      navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
    }}>
      <RecentBoardIcon name={workspaceName} size={32} colour={boardColour} iconSize='20' />
      {workspaceName}/{boardName}
    </MenuItem>
  )
}

const RecentMenuButton = () => {
  const { data: boardsRaw, isLoading, isError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const boards = boardsRaw as unknown as Array<import('../../../types').Board & { workspaceName?: string }> | undefined
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  if (isLoading || isError) return (
    <RecentMenuButtonSkeleton />
  )

  return (
    <div>
      {boards?.length > 0 &&
        <DropdownButton label='Recent' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
          {boards.map((recentBoard) => (
            <RecentBoard
              handleClose={handleClose}
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

export default RecentMenuButton
