import React from 'react'
import { Skeleton } from '@mui/material'

const UserSettingsViewSkeleton = () => {
  return (
    <div className=''>
      <Skeleton variant='rectangular' width={160} height={40} />
    </div>
  )
}

export default UserSettingsViewSkeleton
