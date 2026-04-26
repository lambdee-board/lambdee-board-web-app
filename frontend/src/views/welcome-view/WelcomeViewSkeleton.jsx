import React from 'react'
import { Skeleton } from '@mui/material'

const WelcomeViewSkeleton = () => {
  return (
    <div className='welcomeView-wrapper'>
      <div className='welcomeView-message'>
        <Skeleton width={1000} height={80} />
      </div>
      <div className='welcomeView-recents'>
        <Skeleton width={200} height={40} />
        <div className='welcomeView-recents-buttons'>
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} />
        </div>
      </div>
      <div className='welcomeView-recents'>
        <Skeleton width={200} height={40} />
        <div className='welcomeView-recents-buttons'>
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} sx={{ mr: 10 }} />
          <Skeleton width={120} height={120} />
        </div>
      </div>
    </div>
  )
}

export default WelcomeViewSkeleton
