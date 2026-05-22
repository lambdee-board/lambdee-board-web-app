import React from 'react'
import { generatePath, useNavigate } from 'react-router'

import {
  Typography,
  MenuItem,
  Divider
} from '@mui/material'

import useWorkspaces from '../../../api/workspaces'
import WorkspaceIcon from '../../WorkspaceIcon'
import DropdownButton from '../../dropdown-button/DropdownButton'
import WorkspacesMenuButtonSkeleton from './WorkspacesMenuButtonSkeleton'

const WorkspacesMenuButton = () => {
  const { data, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { per: '5', page: '1' } } })
  const workspaces = data ? data.workspaces : null
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  if (isLoading || isError) return (
    <WorkspacesMenuButtonSkeleton />
  )

  return (
    <DropdownButton label='Workspaces' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
      {workspaces.map((workspace) => (
        <MenuItem className='Workspace-menu-item'
          onClick={() => {
            handleClose()
            navigate(generatePath('workspaces/:id', { id: String(workspace.id) }))
          }} key={String(workspace.id)}>
          <WorkspaceIcon name={workspace.name} size={32} />
          {workspace.name}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={() => {
        handleClose()
        navigate('/')
      }}>
        <Typography color='primary'>More...</Typography>
      </MenuItem>
    </DropdownButton>
  )
}

export default WorkspacesMenuButton
