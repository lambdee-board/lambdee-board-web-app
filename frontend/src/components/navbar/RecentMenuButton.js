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
  const { data: workspaces, isLoading, isError } = useWorkspaces({ limit: 5 })
  const navigate = useNavigate()
  // isLoading = true

  if (isLoading || isError) return (
    <DropdownButton label='Recent'>
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
    <DropdownButton label='Recent'>
      {workspaces.map((workspace, index) => (
        <MenuItem onClick={() => navigate(generatePath('workspaces/:id', { id: workspace.id }))} key={`${workspace.name}-${index}`}>
          <WorkspaceIcon name={workspace.name} size={32} />
          {workspace.name}
        </MenuItem>
      ))}
    </DropdownButton>
  )
}

export default RecentMenuButton
