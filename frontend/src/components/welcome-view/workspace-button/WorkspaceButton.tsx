import * as React from 'react'
import { Typography, Button, Box } from '@mui/material'
import { useNavigate, generatePath } from 'react-router-dom'

import WorkspaceIcon from '../../WorkspaceIcon'
import './WorkspaceButton.sass'

interface Props {
  workspaceId: number
  workspaceName: string
}

const WorkspaceButton = ({ workspaceId, workspaceName }: Props) => {
  const navigate = useNavigate()
  return (
    <Box textAlign='center'>
      <Button fullWidth sx={{ textTransform: 'none ' }} className='workspaceButton' onClick={() => {
        localStorage.setItem('sidebarSelected', 'workspace')
        navigate(generatePath('workspaces/:id', { id: String(workspaceId) }))
      }} key={`${workspaceId}`}>
        <WorkspaceIcon name={workspaceName} size={52} />
        <Typography sx={{ color: 'black' }}>{workspaceName}</Typography>
      </Button>
    </Box>
  )
}


export default WorkspaceButton
