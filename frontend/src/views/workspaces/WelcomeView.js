import React from 'react'

import {
  Skeleton,
  Typography,
  Grid
} from '@mui/material'
import PropTypes from 'prop-types'

import useCurrentUser from '../../api/useCurrentUser'
import useBoard from '../../api/useBoard'
import useWorkspaces from '../../api/useWorkspaces'
import WorkspaceButton from '../../components/welcome-view/WorkspaceButton'
import RecentBoardButton from '../../components/welcome-view/RecentBoardButton'

import './WelcomeView.sass'


function WelcomeViewSkeleton() {
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

function WelcomeViewMessage({ userName }) {
  const messages = [
    `Good to see you back, ${userName}!`,
    `Let's get back to work, ${userName}!`,
    `Time to shine, ${userName}!`,
    `You again, ${userName}?`
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  return <Typography color='primary' fontSize={48}>{message}</Typography>
}


export default function WelcomeView() {
  const { data: boards, isBoardsLoading, isBoardsError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const { data: workspaces,  isWorkspacesLoading, isWorkspacesError } = useWorkspaces({ limit: null })
  const { data: user, isLoading, isError } = useCurrentUser()


  if (isLoading || isError || isBoardsLoading || isBoardsError || isWorkspacesError || isWorkspacesLoading) return (
    <WelcomeViewSkeleton />
  )

  return (
    <div className='welcomeView-wrapper'>
      <div className='welcomeView-message'>
        <WelcomeViewMessage userName={user.name} />
      </div>
      {boards?.length > 0 &&
        <div className='welcomeView-recents'>
          <Typography color='primary' fontSize={24}>Recents</Typography>
          <div className='welcomeView-recents-buttons'>
            <Grid container spacing={0}>
              {boards.map((recentBoard) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={recentBoard.id}>
                  <RecentBoardButton boardId={recentBoard.id} boardName={recentBoard.name} boardColour={recentBoard.colour} workspaceId={recentBoard.workspaceId} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      }
      {workspaces?.length > 0 &&
        <div className='welcomeView-workspaces'>
          <Typography color='primary' fontSize={24}>Workspaces</Typography>
          <div className='welcomeView-workspaces-buttons'>
            <Grid container spacing={0}>
              {workspaces.map((workspace) => (
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


WelcomeViewMessage.propTypes = {
  userName: PropTypes.string.isRequired
}
