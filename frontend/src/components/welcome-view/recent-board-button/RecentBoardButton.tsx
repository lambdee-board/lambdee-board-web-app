import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { Typography, Button, Box } from '@mui/material'

import useWorkspace from '../../../api/workspace'

import RecentBoardIcon from '../../recent-board-icon/RecentBoardIcon'

import './RecentBoardButton.sass'

interface Props {
  boardId: number
  boardName: string
  boardColour: string
  workspaceId: number
}

const RecentBoardButton = ({ boardId, boardName, boardColour, workspaceId }: Props) => {
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: null })
  const navigate = useNavigate()


  if (isLoading || isError) return (
    <div></div>
  )


  return (
    <Box sx={{
      textAlign: 'center'
    }} >
      <Button fullWidth sx={{ textTransform: 'none ' }} className='recentBoardButton' onClick={() => {
        localStorage.setItem('sidebarSelected', boardName)
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
      }}>
        <RecentBoardIcon name={workspace.name} size={52} colour={boardColour} iconSize='32' />
        <Typography sx={{ color: 'black' }}>{workspace.name}/{boardName}</Typography>
      </Button>
    </Box>
  )
}


export default RecentBoardButton
