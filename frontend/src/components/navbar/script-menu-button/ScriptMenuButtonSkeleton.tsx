import React from 'react'
import { MenuItem, Skeleton, Divider, Typography } from '@mui/material'
import DropdownButton from '../../dropdown-button/DropdownButton'

const ScriptMenuButtonSkeleton = () => (
  <DropdownButton label='Actions'>
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

export default ScriptMenuButtonSkeleton
