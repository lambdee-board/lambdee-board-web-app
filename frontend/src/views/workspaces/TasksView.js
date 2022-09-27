import React from 'react'
import {
  Card,
  Typography,
  Divider,
  Grid,
  Button,
  Skeleton
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import WorkspaceIcon from '../../components/WorkspaceIcon'
import useWorkspaces from '../../api/useWorkspaces'

import './TasksView.sass'
import UserTasks from '../../components/tasks-view/UserTasks'


export default function TasksView() {
  const { data: workspaces, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { boards: 'visible' } } })
  const [pickedWorkspace, setPickedWorkspace] = React.useState(false)


  if (isLoading || isError) return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-workspaces'>
        <Card className='tasksView-workspaces-card' >
          <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
          <Divider />
          <Grid sx={{ mt: '4px' }} container spacing={2} direction='row'>
            <Grid item xs={4} className='tasksView-workspaces-card-board'>
              <Skeleton variant='rectangular' width={60} height={60} />
            </Grid>
            <Grid item xs={4} className='tasksView-workspaces-card-board'>
              <Skeleton variant='rectangular' width={60} height={60} />
            </Grid>
            <Grid item xs={4} className='tasksView-workspaces-card-board'>
              <Skeleton variant='rectangular' width={60} height={60} />
            </Grid>
          </Grid>
        </Card>
        <Card className='tasksView-workspaces-card' >
          <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
          <Divider />
          <Grid sx={{ mt: '4px' }} container spacing={2} direction='row'>
            <Grid item xs={4} className='tasksView-workspaces-card-board'>
              <Skeleton variant='rectangular' width={60} height={60} />
            </Grid>
            <Grid item xs={4} className='tasksView-workspaces-card-board'>
              <Skeleton variant='rectangular' width={60} height={60} />
            </Grid>
          </Grid>
        </Card>
      </div>
      <Divider />
    </div>
  )

  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-workspaces'>
        {workspaces.map((workspace) => (
          <Button sx={{ textTransform: 'none', flexShrink: '0' }} key={workspace.id} onClick={() => setPickedWorkspace(workspace)}>
            <Card className='tasksView-workspaces-card' sx={ pickedWorkspace.id === workspace.id ? { boxSizing: 'border-box', border: '2px solid #1082F3', } : null}>
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
                  <Grid item xs={4} key={board.id} className='tasksView-workspaces-card-board'>
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
