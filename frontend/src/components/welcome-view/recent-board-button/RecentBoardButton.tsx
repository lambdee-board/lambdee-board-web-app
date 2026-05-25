import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { Typography, Button, Box } from '@mui/material'

import RecentBoardIcon from '../../recent-board-icon/RecentBoardIcon'


interface Props {
  boardId: number
  boardName: string
  boardColor: string
  workspaceId: number
  workspaceName: string
}

const RecentBoardButton = ({ boardId, boardName, boardColor, workspaceId, workspaceName }: Props) => {
  const navigate = useNavigate()

  return (
    <Box sx={{
      textAlign: 'center'
    }} >
      <Button fullWidth sx={{ textTransform: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 2 }} onClick={() => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`)
      }}>
        <RecentBoardIcon name={workspaceName} size={52} color={boardColor} iconSize='32' />
        <Typography sx={{ color: 'black', width: '100%', overflowWrap: 'anywhere' }}>{workspaceName}/{boardName}</Typography>
      </Button>
    </Box>
  )
}


export default RecentBoardButton
