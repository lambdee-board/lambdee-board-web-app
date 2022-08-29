import * as React from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'

import WorkspaceIcon from '../WorkspaceIcon'
import './WorkspaceButton.sass'

const WorkspaceButton = ({ workspaceName }) => {
  return (
    <div className='workspaceButton'>
      <WorkspaceIcon name={workspaceName} size={64} />
      <Typography>{workspaceName}</Typography>
    </div>
  )
}

WorkspaceButton.propTypes = {
  workspaceName: PropTypes.string.isRequired,
}


export default WorkspaceButton
