import React from 'react'
import {
  MenuItem,
  Skeleton
} from '@mui/material'
import { generatePath, useNavigate } from 'react-router'

import WorkspaceIcon from '../WorkspaceIcon'
import DropdownButton from '../DropdownButton'
import useWorkspaces from '../../api/useWorkspaces'

const RecentMenuButton = () => {
  const { workspaces, isLoading, isError } = useWorkspaces(5)
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
    </DropdownButton>
  )

  return (
    <DropdownButton label='Workspaces'>
      {workspaces.map((workspace) => (
        <MenuItem onClick={() => navigate(generatePath('workspaces/:id', { id: workspace.id }))} key={workspace.name}>
          <WorkspaceIcon name={workspace.name} size={32} />
          {workspace.name}
        </MenuItem>
      ))}
    </DropdownButton>
  )
}

export default RecentMenuButton