import React from 'react'

import {
  Skeleton,
  Typography,
  Grid
} from '@mui/material'

import useCurrentUser from '../../api/useCurrentUser'
import useBoard from '../../api/useBoard'
import useWorkspaces from '../../api/useWorkspaces'
import WorkspaceButton from '../../components/welcome-view/WorkspaceButton'
import RecentBoardButton from '../../components/welcome-view/RecentBoardButton'

import './WelcomeView.sass'


function WelcomeViewSkeleton() {
  return (
    <div>
      <Skeleton variant='rectangular' width={160} height={40} />
    </div>
  )
}

function WelcomeViewMessage({ userName }) {
  const random = Math.floor(Math.random() * (5 - 1 + 1)) + 1

  switch (random) {
  case 1:
    return <Typography color='primary' fontSize={48}>Good to see you back, {userName}!</Typography>
  case 2:
    // eslint-disable-next-line react/no-unescaped-entities
    return <Typography color='primary' fontSize={48}>Let's get back to work, {userName}!</Typography>
  case 3:
    return <Typography color='primary' fontSize={48}>Time to shine, {userName}!</Typography>
  case 4:
    return <Typography color='primary' fontSize={48}>Looking good today, {userName}!</Typography>
  case 5:
    return <Typography color='primary' fontSize={48}>You again, {userName}?</Typography>
  }
}


export default function WelcomeView() {
  const { data: board, isBoardLoading, isBoardError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const { data: workspaces,  isWorkspacesLoading, isWorkspacesError } = useWorkspaces({ limit: null })
  const { data: user, isLoading, isError } = useCurrentUser()


  if (isLoading || isError || isBoardLoading || isBoardError || isWorkspacesError || isWorkspacesLoading) return (
    <WelcomeViewSkeleton />
  )

  return (
    <div className='welcomeView-wrapper'>
      <div className='welcomeView-message'>
        <WelcomeViewMessage userName={user.name} />
      </div>
      {board &&
        <div className='welcomeView-recents'>
          <Typography color='primary' fontSize={24}>Recents</Typography>
          <div className='welcomeView-recents-buttons'>
            <Grid container spacing={0}>
              {board?.map((recentBoard) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={recentBoard.id}>
                  <RecentBoardButton boardId={recentBoard.id} boardName={recentBoard.name} boardColour={recentBoard.colour} workspaceId={recentBoard.workspaceId} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      }
      {workspaces &&
        <div className='welcomeView-workspaces'>
          <Typography color='primary' fontSize={24}>Workspaces</Typography>
          <div className='welcomeView-workspaces-buttons'>
            <Grid container spacing={0}>
              {workspaces?.map((workspace) => (
                <Grid item xs={6} sm={6} md={4} lg={2} key={workspace.id}>
                  <WorkspaceButton workspaceId={workspace.id} workspaceName={workspace.name} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      }
    </div>
  )
}
