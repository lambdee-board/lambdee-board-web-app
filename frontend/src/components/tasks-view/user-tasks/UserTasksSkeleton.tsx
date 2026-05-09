import React from 'react'
import { Card, Divider, Skeleton } from '@mui/material'

const UserTasksSkeleton = () => {
  return (
    <Card className='userTasks-card'>
      <div className='userTasks-card-title'>
        <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
      </div>
      <Divider />
      <div className='userTasks-card-lists'>
        <div className='userTasks-card-list'>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UserTasksSkeleton
