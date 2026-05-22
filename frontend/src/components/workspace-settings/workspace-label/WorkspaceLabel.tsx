import * as React from 'react'

import {
  ListItem,
  Typography,
  InputBase
} from '@mui/material'

import apiClient from '../../../api/axios-client'
import { mutateWorkspaces } from '../../../api/workspaces'
import { mutateWorkspace } from '../../../api/workspace'
import useAppAlertStore from '../../../stores/app-alert'

import WorkspaceIcon from '../../WorkspaceIcon'
import type { Workspace } from '../../../types'


interface Props {
  workspace: Workspace
}

const WorkspaceLabel = ({ workspace }: Props) => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editWorkspaceLabelButton, setEditWorkspaceLabel] = React.useState(true)

  const toggleEditWorkspaceLabelButton = () => setEditWorkspaceLabel(!editWorkspaceLabelButton)
  const editWorkspaceLabelRef = React.useRef<HTMLDivElement>(null)

  const editWorkspaceLabelOnClick = () => {
    toggleEditWorkspaceLabelButton()
    setTimeout(() => {
      if (!editWorkspaceLabelRef.current) return
      const nameInput = editWorkspaceLabelRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const editWorkspaceLabel = () => {
    const newLabel = editWorkspaceLabelRef.current!.children[0] as HTMLInputElement
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
        mutateWorkspace({
          id: workspace.id,
          axiosOptions: { params: { boards: 'visible' } },
          data: (currentWorkspace) => ({ ...currentWorkspace, name: updatedWorkspace.name })
        })
        mutateWorkspaces({ axiosOptions: { params: { per: '5', page: '1' } } })
        toggleEditWorkspaceLabelButton()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editWorkspaceLabelInputOnKey = (e: React.KeyboardEvent) => {
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
          onClick={editWorkspaceLabelOnClick}
          variant='h4'
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#DCDCDC', borderRadius: '8px' } }}
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
            onBlur={() => toggleEditWorkspaceLabelButton()}
          />
        </div>
      )}
    </ListItem>
  )
}

export default WorkspaceLabel
