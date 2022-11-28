import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Divider,
  Grid,
  Skeleton
} from '@mui/material'

import useWorkspace from './../../api/workspace'
import WorkspaceTasksList from '../../components/workspace-welcome/WorkspaceTasksList'

import './WorkspaceWelcomeView.sass'

export default function WorkspaceWelcomeView() {
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })


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
          </Grid>
        </Card>
      </div>
      <Divider />
    </div>
  )

  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-userTasks'>
        {workspace.boards?.map((board) => (
          <WorkspaceTasksList key={board.id} workspaceId={workspaceId} boardId={board.id} />
        ))}
      </div>
    </div>
  )
}
