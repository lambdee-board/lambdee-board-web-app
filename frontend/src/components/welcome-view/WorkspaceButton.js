import * as React from 'react'
import {

} from '@mui/material'
import PropTypes from 'prop-types'

import WorkspaceIcon from '../WorkspaceIcon'


const WorkspaceButton = ({ workspaceId, workspaceName }) => {
  return (
    <WorkspaceIcon name={workspaceName} size={64} />
  )
}

WorkspaceButton.propTypes = {
  workspaceId: PropTypes.number.isRequired,
  workspaceName: PropTypes.string.isRequired,
}


export default WorkspaceButton
