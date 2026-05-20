import React from 'react'

import {
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

import './TasksView.sass'

export default function TasksView() {
  const { data, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { boards: 'visible' } } })
  const workspaces = data ? data.workspaces : null
  const [pickedWorkspace, setPickedWorkspace] = React.useState<Workspace | false>(false)

  if (isLoading || isError) return (
    <TasksViewSkeleton />
  )

  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-workspaces'>
        {workspaces.map((workspace) => (
          <Button sx={{ textTransform: 'none', flexShrink: '0' }} key={workspace.id} onClick={() => setPickedWorkspace(workspace)}>
            <Card className='tasksView-workspaces-card' sx={ pickedWorkspace && pickedWorkspace.id === workspace.id ? { boxSizing: 'border-box', border: '2px solid #1082F3', } : undefined}>
              <div className='tasksView-workspaces-card-title'>
                <WorkspaceIcon name={workspace.name} size={52} />
                <Typography sx={{ ml: '10px' }}>
                  {workspace.name}
                </Typography>
              </div>
              <Divider />
              <Grid sx={{ mt: '4px' }} container spacing={2} direction='row'
                alignItems='center' >
                {workspace.boards?.slice(0, 9).map((board) => (
                  <Grid size={4} key={board.id} className='tasksView-workspaces-card-board'>
                    <FontAwesomeIcon icon={faClipboardList} color={board.colour} />
                    <Typography variant='caption'>{board.name}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Button>
        ))}
      </div>
      <Divider />
      {pickedWorkspace &&
        <div className='tasksView-userTasks'>
          {pickedWorkspace.boards?.map((board) => (
            <UserTasks key={board.id} workspaceId={pickedWorkspace.id} boardId={board.id} />
          ))}
        </div>
      }
    </div>
  )
}
