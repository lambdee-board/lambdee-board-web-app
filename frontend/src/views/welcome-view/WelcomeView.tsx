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
    <Typography color='primary' sx={{
      fontSize: 36
    }}>{message}</Typography>
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
    <Box sx={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)', width: 'calc(100% - 16px)', minHeight: 'calc(100vh - 80px)', m: 1, borderRadius: '8px', display: 'inline-flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 18, pb: 18 }}>
        <WelcomeViewMessage userName={user.name} />
      </Box>
      {boards?.length > 0 &&
        <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
          <Typography color='primary' sx={{ fontSize: 20 }}>Recents</Typography>
          <Box sx={{ display: 'flex', width: '60%', pb: 5 }}>
            <Grid container spacing={0}>
              {boards.map((recentBoard) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={recentBoard.id}>
                  <RecentBoardButton boardId={recentBoard.id} boardName={recentBoard.name} boardColor={recentBoard.color} workspaceId={recentBoard.workspaceId} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      }
      {workspaces?.length > 0 &&
        <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
          <Typography color='primary' sx={{ fontSize: 20 }}>Workspaces</Typography>
          <Box sx={{ display: 'flex', width: '60%', pb: 10 }}>
            <Grid container spacing={0}>
              {workspaces.map((workspace) => (
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={workspace.id}>
                  <WorkspaceButton workspaceId={workspace.id} workspaceName={workspace.name} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      }
    </Box>
  )
}
