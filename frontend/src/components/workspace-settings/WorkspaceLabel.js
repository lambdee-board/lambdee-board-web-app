import * as React from 'react'
import PropTypes from 'prop-types'
import {
  ListItem,
  Typography,
  InputBase
} from '@mui/material'
import { useDispatch } from 'react-redux'

import apiClient from '../../api/apiClient'
import { mutateWorkspaces } from '../../api/useWorkspaces'
import { mutateWorkspace } from '../../api/useWorkspace'
import { addAlert } from '../../redux/slices/appAlertSlice'

import './WorkspaceLabel.sass'
import WorkspaceIcon from '../../components/WorkspaceIcon'

const WorkspaceLabel = ({ workspace }) => {
  const dispatch = useDispatch()
  const [editWorkspaceLabelButton, setEditWorkspaceLabel] = React.useState(true)

  const toggleEditWorkspaceLabelButton = () => setEditWorkspaceLabel(!editWorkspaceLabelButton)
  const editWorkspaceLabelRef = React.useRef()

  const editWorkspaceLabelOnClick = () => {
    toggleEditWorkspaceLabelButton()
    setTimeout(() => {
      if (!editWorkspaceLabelRef.current) return
      const nameInput = editWorkspaceLabelRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editWorkspaceLabel = () => {
    const newLabel = editWorkspaceLabelRef.current.children[0]
    if (!newLabel.value || newLabel.value === workspace.name) {
      toggleEditWorkspaceLabelButton()
      return
    }

    const updatedWorkspace = { name: newLabel.value }
    if (!updatedWorkspace.name) {
      setEditWorkspaceLabel(true)
      return
    }

    apiClient.put(`/api/workspaces/${workspace.id}`, updatedWorkspace)
      .then((response) => {
        // successful request
        mutateWorkspace({
          id: workspace.id,
          axiosOptions: { params: { boards: 'visible' } },
          data: (currentWorkspace) => ({ ...currentWorkspace, name: updatedWorkspace.name })
        })
        mutateWorkspaces({ limit: 5 })
        toggleEditWorkspaceLabelButton()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const editWorkspaceLabelInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editWorkspaceLabel()
      break
    case 'Escape':
      e.preventDefault()
      toggleEditWorkspaceLabelButton()
      break
    }
  }
  return (
    <ListItem >
      <WorkspaceIcon name={workspace.name} size={64} />
      {editWorkspaceLabelButton ? (
        <Typography
          className='Workspace-Label'
          onClick={editWorkspaceLabelOnClick}
          variant='h4'
        >
          {workspace.name}
        </Typography>
      ) : (
        <div>
          <InputBase
            ref={editWorkspaceLabelRef}
            fullWidth
            multiline
            defaultValue={workspace.name}
            sx={{ fontSize: 34 }}
            onKeyDown={(e) => editWorkspaceLabelInputOnKey(e)}
            onBlur={(e) => toggleEditWorkspaceLabelButton()}
          />
        </div>
      )}
    </ListItem>
  )
}

export default WorkspaceLabel

WorkspaceLabel.propTypes = {
  workspace: PropTypes.object.isRequired
}


