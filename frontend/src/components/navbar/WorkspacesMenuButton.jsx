import React from 'react'
import { generatePath, useNavigate } from 'react-router'

import {
  Typography,
  MenuItem,
  Skeleton,
  Divider
} from '@mui/material'

import useWorkspaces from '../../api/workspaces'
import WorkspaceIcon from '../WorkspaceIcon'
import DropdownButton from '../DropdownButton'

const WorkspacesMenuButton = () => {
  const { data, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { per: '5', page: '1' } } })
  const workspaces = data ? data.workspaces : null
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)


  const handleClose = () => setAnchorEl(null)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
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
    <DropdownButton label='Workspaces' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
      {workspaces.map((workspace, index) => (
        <MenuItem className='Workspace-menu-item'
          onClick={() => {
            handleClose()
            localStorage.setItem('sidebarSelected', 'workspace')
            navigate(generatePath('workspaces/:id', { id: workspace.id }))
          }} key={`${workspace.name}-${index}`}>
          <WorkspaceIcon name={workspace.name} size={32} />
          {workspace.name}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={() => {
        handleClose()
        localStorage.setItem('sidebarSelected', 'workspace')
        navigate('/')
      }}>
        <Typography color='primary'>More...</Typography>
      </MenuItem>
    </DropdownButton>
  )
}

export default WorkspacesMenuButton
