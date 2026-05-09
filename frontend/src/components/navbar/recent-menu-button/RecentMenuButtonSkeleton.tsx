import React from 'react'
import { MenuItem, Skeleton } from '@mui/material'
import DropdownButton from '../../dropdown-button/DropdownButton'

const RecentMenuButtonSkeleton = () => (
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

export default RecentMenuButtonSkeleton
