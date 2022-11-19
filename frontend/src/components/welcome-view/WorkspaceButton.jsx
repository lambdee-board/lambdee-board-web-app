import * as React from 'react'
import { Typography, Button, Box } from '@mui/material'
import { useNavigate, generatePath,  } from 'react-router-dom'
import PropTypes from 'prop-types'

import WorkspaceIcon from '../WorkspaceIcon'
import './WorkspaceButton.sass'

const WorkspaceButton = ({ workspaceId, workspaceName }) => {
  const navigate = useNavigate()
  return (
    <Box textAlign='center'>
      <Button fullWidth sx={{ textTransform: 'none ' }} className='workspaceButton' onClick={() => navigate(generatePath('workspaces/:id', { id: workspaceId }))} key={`${workspaceId}`}>
        <WorkspaceIcon name={workspaceName} size={52} />
        <Typography color='black'>{workspaceName}</Typography>
      </Button>
    </Box>
  )
}

WorkspaceButton.propTypes = {
  workspaceId: PropTypes.number.isRequired,
  workspaceName: PropTypes.string.isRequired
}


export default WorkspaceButton
