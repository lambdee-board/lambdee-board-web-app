import React from 'react'

import {
  Box,
  Typography,
  Grid
} from '@mui/material'

import useCurrentUser from '../../api/current-user'
import useBoard from '../../api/board'
import useWorkspaces from '../../api/workspaces'

import WorkspaceButton from '../../components/welcome-view/workspace-button/WorkspaceButton'
import RecentBoardButton from '../../components/welcome-view/recent-board-button/RecentBoardButton'
import WelcomeViewSkeleton from './WelcomeViewSkeleton'

import type { Board } from '../../types'

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

  return (
    <Typography variant='h4' color='primary'>{message}</Typography>
  )
}


export default function WelcomeView() {
  const { data: boardsRaw, isLoading: isBoardsLoading, isError: isBoardsError } = useBoard({ id: 'recently_viewed', axiosOptions: { params: { lists: 'visible' } } })
  const boards = boardsRaw as unknown as Board[]
  const { data,  isLoading: isWorkspacesLoading, isError: isWorkspacesError } = useWorkspaces()
  const workspaces = data ? data.workspaces : null
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading || isError || isBoardsLoading || isBoardsError || isWorkspacesError || isWorkspacesLoading) return (
    <WelcomeViewSkeleton />
  )

  return (
    <Box sx={{ backgroundColor: 'primary.light', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 18, pb: 18 }}>
        <WelcomeViewMessage userName={user.name} />
      </Box>
      {boards?.length > 0 &&
        <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
          <Typography variant='h6' color='primary'>Recents</Typography>
          <Box sx={{ display: 'flex', width: '60%', pb: 5 }}>
            <Grid container spacing={0}>
              {boards.map((recentBoard) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={recentBoard.id}>
                  <RecentBoardButton boardId={recentBoard.id} boardName={recentBoard.name} boardColor={recentBoard.color} workspaceId={recentBoard.workspaceId} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      }
      {workspaces?.length > 0 &&
        <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
          <Typography variant='h6' color='primary'>Workspaces</Typography>
          <Box sx={{ display: 'flex', width: '60%', pb: 10 }}>
            <Grid container spacing={0}>
              {workspaces.map((workspace) => (
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={workspace.id}>
                  <WorkspaceButton workspaceId={workspace.id} workspaceName={workspace.name} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      }
    </Box>
  )
}
