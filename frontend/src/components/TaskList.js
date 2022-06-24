import React, { useCallback, useState, } from 'react'
import update from 'immutability-helper'
import {
  List,
  ListItem,
  Paper,
  ListSubheader,
  Typography,
  IconButton,
  Button,
  Skeleton,
  Card,
  InputBase,
  Modal,
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { assign } from 'lodash'
import { ReactSortable } from 'react-sortablejs'

import apiClient from '../api/apiClient'
import { TaskCardSkeleton, TaskCard } from './TaskCard'
import useList, { mutateList } from '../api/useList'

import './TaskList.sass'
import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import TaskListModal from './TaskListModal'


function TaskListSkeletonContent() {
  return (
    <>
      <ListItem className='TaskList-item' >
        <TaskCardSkeleton />
      </ListItem>
      <ListItem className='TaskList-item' >
        <TaskCardSkeleton />
      </ListItem>
      <ListItem className='TaskList-item' >
        <TaskCardSkeleton />
      </ListItem>
    </>
  )
}

function TaskListSkeleton() {
  return (

    <Box className='TaskList-wrapper'>
      <Paper className='TaskList-paper'
        elevation={5}>
        <List className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Skeleton height={36} width={200} variant='text' />
            <Skeleton height={36} width={36} variant='circular' />
          </ListSubheader>} >
          <TaskListSkeletonContent />
        </List>
        <Box className='TaskList-new-task-wrapper' sx={{ display: 'flex' }}>
          <Skeleton height={36} width={70} variant='text' sx={{ ml: 2, mb: 1 }} />
        </Box>
      </Paper>
    </Box>
  )
}

function TaskList(props) {
  const { data: taskList, mutate } = useList({ id: props.id, axiosOptions: { params: { tasks: 'all' } } })

  const [sortedTasks, setNewTaskOrder] = React.useState([])

  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()
  const dispatch = useDispatch()

  const [taskListModalState, setTaskListModalState] = useState(false)
  const toggleTaskListModalState = () => {
    setTaskListModalState(!taskListModalState)
  }


  React.useEffect(() => {
    if (!taskList) return

    const sortedTasksList = [...taskList.tasks].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskOrder([...sortedTasksList])
  }, [taskList])


  const toggleNewTaskButton = () => setNewTaskButtonVisible(!newTaskButtonVisible)

  const newTaskButtonOnClick = () => {
    toggleNewTaskButton()
    setTimeout(() => {
      if (!listRef.current || !newTaskInputRef.current) return

      const currentList = listRef.current
      currentList.scrollTop = currentList.scrollHeight + 200
      const nameInput = newTaskInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const createNewTask = () => {
    const nameInput = newTaskInputRef.current.children[0]
    const newTask = {
      name: nameInput.value,
      listId: props.id,
      authorId: 1, // TODO: these values should be fetched
    }
    apiClient.post('/api/tasks', newTask)
      .then((response) => {
        // successful request
        mutate({ ...taskList, tasks: [...taskList?.tasks || [], response.data] })
        toggleNewTaskButton()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
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
      toggleNewTaskButton()
      break
    }
  }

  return (
    <Box className='TaskList-wrapper'>
      <Paper className='TaskList-paper'
        elevation={5}>
        <List ref={listRef} className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Typography className='TaskList-header-text' >
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary' onClick={toggleTaskListModalState}>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          {taskList ? (<ReactSortable list={sortedTasks} setList={setNewTaskOrder}>
            {
              sortedTasks.map((task, taskIndex) => (
                <ListItem className='TaskList-item' key={taskIndex} >
                  <TaskCard key={`${task.name}-${task.id}`}
                    id={task.id}
                    label={task.name}
                    tags={task.tags}
                    priority={task.priority}
                    assignedUsers={task.users}
                    points={task.points}
                    pos={task.pos}
                    index={taskIndex}
                    listId={task.listId}
                  />
                </ListItem>
              ))}
          </ReactSortable>
          ) : (
            <TaskListSkeletonContent />
          )}

          { !newTaskButtonVisible &&
            <Card
              className='TaskList-new-task'>
              <InputBase
                ref={newTaskInputRef}
                className='TaskList-new-task-input'
                fullWidth
                multiline
                placeholder='Task Label'
                onKeyDown={(e) => newTaskNameInputOnKey(e)}
                onBlur={(e) => toggleNewTaskButton()}
              />
              <IconButton className='TaskList-new-task-cancel' onClick={() => toggleNewTaskButton()}>
                <FontAwesomeIcon className='TaskList-new-task-cancel-icon' icon={faXmark} />
              </IconButton>
            </Card>
          }
        </List>
        <Box className='TaskList-new-task-wrapper'>
          {newTaskButtonVisible &&
            <Button onClick={newTaskButtonOnClick} className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Task</Typography>
            </Button>
          }
        </Box>
      </Paper>
      {taskList &&
      <Modal
        open={taskListModalState}
        onClose={toggleTaskListModalState}
        className='TaskList-modal-wrapper'
      >
        <div className='TaskList-modal'>
          <TaskListModal listId={props.id} title={props.title} />
        </div>
      </Modal>
      }
    </Box>
  )
}

TaskList.propTypes = {
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default TaskList
export { TaskList, TaskListSkeleton }
