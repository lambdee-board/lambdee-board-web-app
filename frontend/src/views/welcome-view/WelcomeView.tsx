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
import WelcomeViewMessage from '../../components/welcome-view/welcome-view-message/WelcomeViewMessage'
import WelcomeViewSkeleton from './WelcomeViewSkeleton'

import type { Board } from '../../types'


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
          <Box sx={{ width: '60%', pb: 10 }}>
            <Grid container spacing={0}>
              {boards.map((recentBoard) => {
                const workspaceName = workspaces?.find((w) => w.id === recentBoard.workspaceId)?.name ?? ''
                return (
                  <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={recentBoard.id}>
                    <RecentBoardButton boardId={recentBoard.id}
                      boardName={recentBoard.name}
                      boardColor={recentBoard.color}
                      workspaceId={recentBoard.workspaceId}
                      workspaceName={workspaceName} />
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </Box>
      }
      {workspaces?.length > 0 &&
        <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'start', alignItems: 'center' }}>
          <Typography variant='h6' color='primary'>Workspaces</Typography>
          <Box sx={{ width: '60%', pb: 10 }}>
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
