import React from 'react'
import {
  Typography,
  MenuItem,
  Skeleton,
  Divider
} from '@mui/material'
import { generatePath, useNavigate } from 'react-router'

import WorkspaceIcon from '../WorkspaceIcon'
import DropdownButton from '../DropdownButton'
import useWorkspaces from '../../api/useWorkspaces'

const WorkspacesMenuButton = () => {
  const { data: workspaces, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { limit: '5' } } })
  const navigate = useNavigate()
  // isLoading = true

  if (isLoading || isError) return (
    <DropdownButton label='Workspaces'>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
      <Divider />
      <MenuItem>
        <Typography color='primary'>More...</Typography>
      </MenuItem>
    </DropdownButton>
  )

  return (
    <DropdownButton label='Workspaces'>
      {workspaces.map((workspace, index) => (
        <MenuItem className='Workspace-menu-item' onClick={() => navigate(generatePath('workspaces/:id', { id: workspace.id }))} key={`${workspace.name}-${index}`}>
          <WorkspaceIcon name={workspace.name} size={32} />
          {workspace.name}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem>
        <Typography color='primary'>More...</Typography>
      </MenuItem>
    </DropdownButton>
  )
}

export default WorkspacesMenuButton
