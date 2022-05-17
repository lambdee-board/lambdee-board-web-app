import React from 'react'
import { List, ListItem, Paper, ListSubheader, Typography, IconButton, Button, Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

import './TaskList.sass'

function TaskListSkeleton(props) {
  return (
    <Box>
      <List className='TaskList'
        subheader={<ListSubheader className='TaskList-header' >
          <Skeleton height={36} width={200} variant='text' />
          <Skeleton height={46} width={46} variant='rectangular' />
        </ListSubheader>} >
        <ListItem className='TaskList-item' key='skeleton' >
        </ListItem>
      </List>
      <Box className='TaskList-new-task-wrapper-skeleton' >
        <Skeleton className='TaskList-new-task-item-skeleton' height={36} width={36} variant='rectangular' />
        <Skeleton className='TaskList-new-task-item-skeleton' height={26} width={100} variant='text' />
      </Box>
    </Box>
  )
}

export default function TaskList(props) {
  // const { data: taskList, isLoading, isError } = useTaskList()
  const isLoading = true
  const isError = null

  return (
    <Box className='TaskList-wrapper'>
      <Paper className='TaskList-paper'
        elevation={5}>
        {isLoading || isError ? (
          <TaskListSkeleton />
        ) :
          (
            <Box>
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
            </Box>
          )}
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
}
