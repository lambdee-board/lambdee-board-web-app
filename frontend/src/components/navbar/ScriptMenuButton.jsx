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
import useScriptTriggers from '../../api/scripts-triggers'

const ScriptMenuButton = () => {
  const { data: workspaces, isLoading, isError } = useScriptTriggers({ axiosOptions: { params: { limit: '5' } } })
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
    <DropdownButton label='Actions' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
      {workspaces.map((workspace, index) => (
        <MenuItem className='Workspace-menu-item'
          onClick={() => {
            handleClose()
            navigate(generatePath('workspaces/:id', { id: workspace.id }))
          }} key={`${workspace.name}-${index}`}>
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

export default ScriptMenuButton
