import React from 'react'
import {
  Skeleton,
  Typography,
} from '@mui/material'

import useCurrentUser from '../../api/useCurrentUser'

import './WelcomeView.sass'


function WelcomeViewSkeleton() {
  return (
    <div>
      <Skeleton variant='rectangular' width={160} height={40} />
    </div>
  )
}


export default function WelcomeView() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading || isError) return (
    <WelcomeViewSkeleton />
  )

  return (
    <div className='welcomeView-wrapper'>
      <div className='welcomeView-message'>
        <Typography color='primary' fontSize={48}>Good to see you back, {user.name}!</Typography>
      </div>
    </div>
  )
}
