import React from 'react'
import { List, ListItem, Paper, Toolbar, InputBase, Card, ListSubheader, Typography, IconButton, Button } from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import apiClient from '../api/apiClient'

import './TaskList.sass'


export default function TaskList(props) {
  const [visible, setVisible] = React.useState(true)
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()

  const handleNewTaskClick = () => {
    setVisible(!visible)
    setTimeout(() => {
      if (!listRef.current || !newTaskInputRef.current) return

      const taskList = listRef.current
      taskList.scrollTop = taskList.scrollHeight + 200
      const nameInput = newTaskInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const createNewTask = () => {
    const nameInput = newTaskInputRef.current.children[0]
    const newTask = {
      name: nameInput.value,
      listId: 1, // TODO: these values should be fetched
      authorId: 1,
    }
    apiClient.post('/api/tasks', newTask)
      .then((response) => {
        // successful request
      })
      .catch((error) => {
        // failed or rejected
      })
  }

  const newTaskNameInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      createNewTask()
      break
    case 'Escape':
      e.preventDefault()
      setVisible(!visible)
      break
    }
  }

  return (
    <Box className='TaskList-wrapper'>
      <Toolbar />
      <Paper className='TaskList-paper'
        elevation={5}>
        <List ref={listRef} className='TaskList'
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
          <Card style={{ display: visible && 'none' }} className='TaskList-new-task'>
            <InputBase
              ref={newTaskInputRef}
              className='TaskList-new-task-input'
              fullWidth
              multiline
              placeholder='Task Label'
              onKeyDown={newTaskNameInputOnKey}
            />
            <IconButton className='TaskList-new-task-cancel' onClick={() => setVisible(!visible)}>
              <FontAwesomeIcon className='TaskList-new-task-cancel-icon' icon={faXmark} />
            </IconButton>
          </Card>
        </List>
        <Box className='TaskList-new-task-wrapper'>
          {visible &&
            <Button onClick={handleNewTaskClick} className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Task</Typography>
            </Button>
          }
        </Box>
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
}
