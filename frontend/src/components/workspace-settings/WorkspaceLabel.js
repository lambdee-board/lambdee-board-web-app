import * as React from 'react'
import PropTypes from 'prop-types'
import {
  ListItem,
  Typography,
  InputBase
} from '@mui/material'

import { useDispatch } from 'react-redux'
import WorkspaceIcon from '../../components/WorkspaceIcon'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'

const WorkspaceLabel = ({ workspace, mutate }) => {
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
    const updatedLabel = { name: newLabel.value }
    if (!updatedLabel.name) {
      setEditWorkspaceLabel(true)
      return
    }

    apiClient.put(`/api/workspaces/${workspace.id}`, updatedLabel)
      .then((response) => {
        // successful request
        mutate()
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
    <ListItem className='ListItem-workspace'>
      <WorkspaceIcon name={workspace.name} size={64} />
      {editWorkspaceLabelButton ? (
        <Typography variant='h4'
          onClick={editWorkspaceLabelOnClick}
        >{workspace.name}</Typography>
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
  workspace: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired,
}


