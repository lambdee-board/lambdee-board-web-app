import React from 'react'
import { ListItem, Avatar, Skeleton } from '@mui/material'

const ReportCardSkeleton = () => {
  return (
    <div>
      <ListItem divider>
        <div className='UserListItem'>
          <div className='UserListItem-base'>
            <Avatar className='UserListItem-avatar' />
            <Skeleton height={36} width={200} variant='text' />
          </div>
          <Skeleton height={36} width={100} variant='text' />
          <Skeleton height={36} width={100} variant='text' />
        </div>
      </ListItem>
    </div>
  )
}

export default ReportCardSkeleton
