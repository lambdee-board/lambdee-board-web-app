import React from 'react'
import {
  List,
  ListItem,
  Paper,
  ListSubheader,
  Skeleton,
} from '@mui/material'
import { Box } from '@mui/system'
import TaskCardSkeleton from '../task-card/TaskCardSkeleton'

function TaskListSkeletonContent() {
  return (
    <>
      <ListItem>
        <TaskCardSkeleton />
      </ListItem>
      <ListItem>
        <TaskCardSkeleton />
      </ListItem>
      <ListItem>
        <TaskCardSkeleton />
      </ListItem>
    </>
  )
}

const TaskListSkeleton = () => {
  return (
    <Box>
      <Paper elevation={5}>
        <List
          subheader={<ListSubheader>
            <Skeleton height={36} width={200} variant='text' />
            <Skeleton height={36} width={36} variant='circular' />
          </ListSubheader>}>
          <TaskListSkeletonContent />
        </List>
        <Box sx={{ display: 'flex' }}>
          <Skeleton height={36} width={70} variant='text' sx={{ ml: 2, mb: 1 }} />
        </Box>
      </Paper>
    </Box>
  )
}

export default TaskListSkeleton
