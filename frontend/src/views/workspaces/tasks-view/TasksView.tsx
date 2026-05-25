import React from 'react'

import {
  Box,
  Card,
  Typography,
  Divider,
  Grid,
  Button,
} from '@mui/material'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useWorkspaces from '../../../api/workspaces'
import type { Workspace } from '../../../types'

import UserTasks from '../../../components/tasks-view/user-tasks/UserTasks'
import WorkspaceIcon from '../../../components/WorkspaceIcon'
import TasksViewSkeleton from './TasksViewSkeleton'


export default function TasksView() {
  const { data, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { boards: 'visible' } } })
  const workspaces = data ? data.workspaces : null
  const [pickedWorkspace, setPickedWorkspace] = React.useState<Workspace | false>(false)

  if (isLoading || isError) return (
    <TasksViewSkeleton />
  )

  return (
    <Box sx={{ bgcolor: 'primary.light', width: 'calc(100% - 16px)', minHeight: '656px', height: 'calc(100vh - 80px)', m: 1, borderRadius: '8px', display: 'inline-flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', overflowX: 'auto', overflowY: 'hidden', flexDirection: 'row', alignItems: 'center', pt: 1, minHeight: '320px' }}>
        {workspaces.map((workspace) => (
          <Button sx={{ textTransform: 'none', flexShrink: '0' }} key={workspace.id} onClick={() => setPickedWorkspace(workspace)}>
            <Card sx={{ display: 'flex', flexDirection: 'column', width: '304px', height: '272px', m: 2, ...(pickedWorkspace && pickedWorkspace.id === workspace.id ? { boxSizing: 'border-box', border: '2px solid #1082F3' } : {}) }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <WorkspaceIcon name={workspace.name} size={52} />
                <Typography sx={{ ml: 1.25 }}>
                  {workspace.name}
                </Typography>
              </Box>
              <Divider />
              <Grid
                container
                spacing={2}
                direction='row'
                sx={{
                  alignItems: 'center',
                  mt: 0.5
                }}>
                {workspace.boards?.slice(0, 9).map((board) => (
                  <Grid size={4} key={board.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faClipboardList} color={board.color} />
                    <Typography variant='caption'>{board.name}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Button>
        ))}
      </Box>
      <Divider />
      {pickedWorkspace &&
        <Box sx={{ height: '100%', minHeight: '320px', overflowX: 'auto', display: 'flex', flexDirection: 'row', pt: 1 }}>
          {pickedWorkspace.boards?.map((board) => (
            <UserTasks key={board.id} workspaceId={pickedWorkspace.id} boardId={board.id} />
          ))}
        </Box>
      }
    </Box>
  )
}
