import React from 'react'
import {
  List,
  ListItem,
  Paper,
  ListSubheader,
  Typography,
  IconButton,
  Button,
  Skeleton
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

import useTasks from '../api/useTasks'
import { TaskCardSkeleton } from './TaskCard'

import './TaskList.sass'

function TaskListSkeleton() {
  return (
    <Paper className='TaskList-paper'
      elevation={5}>
      <List className='TaskList'
        subheader={<ListSubheader className='TaskList-header' >
          <Skeleton height={36} width={200} variant='text' />
          <Skeleton height={36} width={36} variant='circular' />
        </ListSubheader>} >
        <ListItem className='TaskList-item' >
          <TaskCardSkeleton />
        </ListItem>
        <ListItem className='TaskList-item' >
          <TaskCardSkeleton />
        </ListItem>
        <ListItem className='TaskList-item' >
          <TaskCardSkeleton />
        </ListItem>
      </List>
      <Box className='TaskList-new-task-wrapper' sx={{ display: 'flex' }}>
        <Skeleton height={36} width={70} variant='text' sx={{ ml: 2, mb: 1 }} />
      </Box>
    </Paper>
  )
}

export default function TaskList(props) {
  let { data: tasks, isLoading, isError } = useTasks()
  isLoading = true
  return (
    <Box className='TaskList-wrapper'>
      {isLoading || isError ? (
        <TaskListSkeleton />
      ) :
        (
          <Paper className='TaskList-paper'
            elevation={5}>
            <List className='TaskList'
              subheader={<ListSubheader className='TaskList-header' >
                <Typography className='TaskList-header-text' >
                  {props.title}
                </Typography>
                <IconButton aria-label='Edit' color='secondary'>
                  <FontAwesomeIcon icon={faPencil} />
                </IconButton>
              </ListSubheader>} >
              {props.children.map((item, index) => (
                <ListItem className='TaskList-item' key={index} >
                  {item}
                </ListItem>
              ))}
            </List>
            <Box className='TaskList-new-task-wrapper'>
              <Button className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
                <Typography>New task</Typography>
              </Button>
            </Box>
          </Paper>
        )}
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  pos: PropTypes.array.isRequired,
}
