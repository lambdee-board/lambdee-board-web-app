import React from 'react'
import {
  List,
  Paper,
  ListSubheader,
  Typography,
  Skeleton,
  Card,
} from '@mui/material'
import { Box } from '@mui/system'

const TaskPlanningListSkeleton = () => {
  return (
    <Box className='TaskListPlanning-wrapper'>
      <Paper className='TaskListPlanning-paper' elevation={5}>
        <List className='TaskListPlanning'
          subheader={<ListSubheader className='TaskListPlanning-header'>
            <Typography className='TaskListPlanning-header-text'>
              <Skeleton height={36} width={200} />
            </Typography>
          </ListSubheader>}>
          <Card sx={{ pl: '4px', pr: '4px', ml: '8px', mr: '8px' }}>
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </Card>
        </List>
      </Paper>
    </Box>
  )
}

export default TaskPlanningListSkeleton
