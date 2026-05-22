import * as React from 'react'
import { Typography, Button, Box } from '@mui/material'
import { useNavigate, generatePath } from 'react-router-dom'

import WorkspaceIcon from '../../WorkspaceIcon'

interface Props {
  workspaceId: number
  workspaceName: string
}

const WorkspaceButton = ({ workspaceId, workspaceName }: Props) => {
  const navigate = useNavigate()
  return (
    <Box sx={{
      textAlign: 'center'
    }}>
      <Button fullWidth sx={{ textTransform: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 2 }} onClick={() => {
        navigate(generatePath('workspaces/:id', { id: String(workspaceId) }))
      }} key={`${workspaceId}`}>
        <WorkspaceIcon name={workspaceName} size={52} />
        <Typography sx={{ color: 'black' }}>{workspaceName}</Typography>
      </Button>
    </Box>
  )
}


export default WorkspaceButton
