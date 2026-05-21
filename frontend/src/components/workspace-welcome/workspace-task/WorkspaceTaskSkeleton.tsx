import React from 'react'
import { Skeleton } from '@mui/material'

const WorkspaceTaskSkeleton = () => {
  return (
    <div>
      <div>
        <div>
          <Skeleton width={270} height={40} />
        </div>
      </div>
      <div>
        <div>
          <Skeleton width={270} height={40} />
        </div>
      </div>
      <div>
        <div>
          <Skeleton width={270} height={40} />
        </div>
      </div>
    </div>
  )
}

export default WorkspaceTaskSkeleton
