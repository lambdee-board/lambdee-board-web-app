import React from 'react'
import {
  Skeleton,
  Typography,
  Grid
} from '@mui/material'

import useCurrentUser from '../../api/useCurrentUser'
import useBoard from '../../api/useBoard'
import useWorkspaces from '../../api/useWorkspaces'
import useUsers from '../../api/useUsers'

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
  const { data: board, isBoardLoading, isBoardError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const { data: workspaces,  isWorkspacesLoading, isWorkspacesError } = useWorkspaces({ limit: null })

  if (isLoading || isError || isBoardLoading || isBoardError || isWorkspacesError || isWorkspacesLoading) return (
    <WelcomeViewSkeleton />
  )

  return (
    <div className='welcomeView-wrapper'>
      <div className='welcomeView-message'>
        <Typography color='primary' fontSize={48}>Good to see you back, {user.name}!</Typography>
      </div>
      <div className='welcomeView-recents'>
        <Typography color='primary' fontSize={24}>Recents</Typography>
        <div className='welcomeView-recents-buttons'>
          <Grid container spacing={0}
            justifyContent='space-evenly'
          >
            {board?.map((recentBoard) => (
              <Grid item xs={6} md={2} key={recentBoard.id}>
                <div className='welcomeView-recents-button'>
                  {recentBoard.name}
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className='welcomeView-workspaces'>
        <Typography color='primary' fontSize={24}>Workspaces</Typography>
        <div className='welcomeView-workspaces-buttons'>
          <Grid container spacing={0}
            justifyContent='space-evenly'
          >
            {workspaces?.map((workspace) => (
              <Grid item xs={6} md={2} key={workspace.id}>
                <div>
                  {workspace.name}
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  )
}
