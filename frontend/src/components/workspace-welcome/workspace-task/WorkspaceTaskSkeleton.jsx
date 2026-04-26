import React from 'react'
import { Skeleton } from '@mui/material'

const WorkspaceTaskSkeleton = () => {
  return (
    <div>
      <div className='Tasks-card-list-task'>
        <div className='Tasks-card-list-task-wrapper'>
          <Skeleton width={270} height={40} />
        </div>
      </div>
      <div className='Tasks-card-list-task'>
        <div className='Tasks-card-list-task-wrapper'>
          <Skeleton width={270} height={40} />
        </div>
      </div>
      <div className='Tasks-card-list-task'>
        <div className='Tasks-card-list-task-wrapper'>
          <Skeleton width={270} height={40} />
        </div>
      </div>
    </div>
  )
}

export default WorkspaceTaskSkeleton
