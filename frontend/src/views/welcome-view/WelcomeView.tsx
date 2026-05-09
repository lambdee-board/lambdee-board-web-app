import React from 'react'

import {
  Typography,
  Grid
} from '@mui/material'

import useCurrentUser from '../../api/current-user'
import useBoard from '../../api/board'
import useWorkspaces from '../../api/workspaces'

import WorkspaceButton from '../../components/welcome-view/workspace-button/WorkspaceButton'
import RecentBoardButton from '../../components/welcome-view/recent-board-button/RecentBoardButton'
import WelcomeViewSkeleton from './WelcomeViewSkeleton'

import './WelcomeView.sass'

interface WelcomeViewMessageProps {
  userName: string
}

function WelcomeViewMessage({ userName }: WelcomeViewMessageProps) {
  const messages = [
    `Good to see you back, ${userName}!`,
    `Let's get back to work, ${userName}!`,
    `Time to shine, ${userName}!`,
    `You again, ${userName}?`
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  return <Typography color='primary' fontSize={36}>{message}</Typography>
}


export default function WelcomeView() {
  const { data: boardsRaw, isLoading: isBoardsLoading, isError: isBoardsError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const boards = boardsRaw as unknown as Array<import('../../types').Board>
  const { data,  isLoading: isWorkspacesLoading, isError: isWorkspacesError } = useWorkspaces()
  const workspaces = data ? data.workspaces : null
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
          <Typography color='primary' fontSize={20}>Recents</Typography>
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
          <Typography color='primary' fontSize={20}>Workspaces</Typography>
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
