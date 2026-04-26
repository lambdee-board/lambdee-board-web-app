import React from 'react'
import { Card, Divider, Skeleton } from '@mui/material'

const WorkspaceTasksListSkeleton = () => {
  return (
    <div>
      <Card className='Tasks-card'>
        <div className='Tasks-card-title'>
          <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
        </div>
        <Divider />
        <div className='Tasks-card-lists'>
          <div className='Tasks-card-list'>
            <div className='Tasks-card-list-title'>
              <Skeleton width={180} height={40} />
            </div>
            <div className='Tasks-card-list-title'>
              <Skeleton width={180} height={40} />
            </div>
            <div className='Tasks-card-list-title'>
              <Skeleton width={180} height={40} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default WorkspaceTasksListSkeleton
