import * as React from 'react'
import {

} from '@mui/material'
import PropTypes from 'prop-types'

import useWorkspace from '../../api/useWorkspace'
import WorkspaceIcon from '../WorkspaceIcon'

const WorkspaceBoardButton = ({ boardId, boardName, workspaceId }) => {
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: null })


  if (isLoading || isError) return (
    'xd'
  )


  return (
    <WorkspaceIcon name={workspace.name} size={64} />
  )
}

WorkspaceBoardButton.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardName: PropTypes.string.isRequired,
  workspaceId: PropTypes.number.isRequired
}


export default WorkspaceBoardButton
