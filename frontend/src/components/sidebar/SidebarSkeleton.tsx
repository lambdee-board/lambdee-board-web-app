import React from 'react'
import { List, ListItemButton, Skeleton } from '@mui/material'

const SidebarSkeleton = () => {
  return (
    <List>
      <ListItemButton divider>
        <Skeleton height={46} width={46} variant='rectangular' />
        <Skeleton height={36} width={100} variant='text' />
      </ListItemButton>
      <ListItemButton divider>
        <div>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItemButton>
      <ListItemButton divider>
        <div>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItemButton>
      <ListItemButton divider>
        <div>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItemButton>
    </List>
  )
}

export default SidebarSkeleton
