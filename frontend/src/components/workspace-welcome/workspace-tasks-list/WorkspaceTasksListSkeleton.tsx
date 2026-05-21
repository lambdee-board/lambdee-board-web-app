import React from 'react'
import { Card, Divider, Skeleton } from '@mui/material'

const WorkspaceTasksListSkeleton = () => {
  return (
    <div>
      <Card>
        <div>
          <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
        </div>
        <Divider />
        <div>
          <div>
            <div>
              <Skeleton width={180} height={40} />
            </div>
            <div>
              <Skeleton width={180} height={40} />
            </div>
            <div>
              <Skeleton width={180} height={40} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default WorkspaceTasksListSkeleton
