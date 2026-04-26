import React from 'react'
import { Card, Divider, Grid, Skeleton } from '@mui/material'

const TasksViewSkeleton = () => {
  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-workspaces'>
        <Card className='tasksView-workspaces-card'>
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
        <Card className='tasksView-workspaces-card'>
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
}

export default TasksViewSkeleton
