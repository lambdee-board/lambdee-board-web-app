import React from 'react'
import { Card, Divider, Skeleton } from '@mui/material'

const UserTasksSkeleton = () => {
  return (
    <Card>
      <div>
        <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
      </div>
      <Divider />
      <div>
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
      </div>
    </Card>
  )
}

export default UserTasksSkeleton
