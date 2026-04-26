import React from 'react'
import { List, ListItem, Skeleton } from '@mui/material'

const SidebarSkeleton = () => {
  return (
    <List className='List List-skeleton'>
      <ListItem className='ListItem-workspace' button divider>
        <Skeleton height={46} width={46} variant='rectangular' />
        <Skeleton height={36} width={100} variant='text' />
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
    </List>
  )
}

export default SidebarSkeleton
