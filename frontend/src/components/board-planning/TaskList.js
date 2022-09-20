import React, { useState } from 'react'
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
  Divider,
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { ReactSortable } from 'react-sortablejs'

import apiClient from '../../api/apiClient'
import { TaskCardSkeleton, TaskCard } from '../TaskCard'
import useList from '../../api/useList'
import { calculatePos } from '../../constants/componentPositionService'

import './TaskList.sass'
import { addAlert } from '../../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import TaskListModal from '../TaskListModal'

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

    const newSortedTasks = [...taskList.tasks].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskOrder([...newSortedTasks])
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

  const updateTaskPos = (id, newPos, updatedTasks) => {
    setNewTaskOrder(updatedTasks)

    const updatedTask = {
      id,
      listId: props.id,
      pos: newPos,
    }

    apiClient.put(`/api/tasks/${id}`, updatedTask)
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
      .finally(() => {
        console.log(updatedTasks)
        mutate((listData) => ({ ...listData, tasks: updatedTasks }))
      })
  }

  const updateTaskOrder = (updatedTasks) => {
    // Check if there are any changes to the order of elements
    // if the current task list has the same number
    // of elements as the updated list
    if (updatedTasks.length === sortedTasks.length) {
      let tasksAreEqual = true
      for (let i = 0; i < sortedTasks.length; i++) {
        if (sortedTasks[i].id !== updatedTasks[i].id) {
          tasksAreEqual = false
          break
        }
      }

      // if there are no changes just skip it
      if (tasksAreEqual) return
    }

    const currentTaskIndex = updatedTasks.findIndex((list) => list.chosen !== undefined)

    // if the dragged task is no longer in this list, just remove it and return
    if (currentTaskIndex === -1) {
      setNewTaskOrder(updatedTasks)
      mutate((listData) => ({ ...listData, tasks: updatedTasks }))
      return
    }

    const newUpdatedTasks = [...updatedTasks]
    const newUpdatedTask = { ...newUpdatedTasks[currentTaskIndex] }
    newUpdatedTask.pos = calculatePos(currentTaskIndex, updatedTasks)
    newUpdatedTasks[currentTaskIndex] = newUpdatedTask

    updateTaskPos(newUpdatedTask.id, newUpdatedTask.pos, newUpdatedTasks)
  }
  return (
    <Box className='TaskListPlanning-wrapper' sx={props.title === 'Backlog' ? { mt: '60px' } : { mt: '20px' }}>
      <Paper className='TaskListPlanning-paper'
        elevation={5}>
        <List ref={listRef} className='TaskListPlanning'
          subheader={<ListSubheader className='TaskListPlanning-header' >
            <Typography className='TaskListPlanning-header-text' >
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary' onClick={toggleTaskListModalState}>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          <div>
            {taskList ? (
              <ReactSortable
                list={sortedTasks}
                setList={updateTaskOrder}
                group='TaskCardList'
                delay={1}
                animation={50}
                ghostClass='translucent'
                selectedClass='translucent'
                direction='vertical'
                // multiDrag
                scroll
              >
                {
                  sortedTasks.map((task, taskIndex) => (
                    <ListItem className='TaskListPlanning-item' key={taskIndex} >
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
          </div>

          { !newTaskButtonVisible &&
            <Card
              className='TaskListPlanning -new-task'>
              <InputBase
                ref={newTaskInputRef}
                className='TaskListPlanning -new-task-input'
                fullWidth
                multiline
                placeholder='Task Label'
                onKeyDown={(e) => newTaskNameInputOnKey(e)}
                onBlur={(e) => toggleNewTaskButton()}
              />
              <IconButton className='TaskListPlanning -new-task-cancel' onClick={() => toggleNewTaskButton()}>
                <FontAwesomeIcon className='TaskListPlanning -new-task-cancel-icon' icon={faXmark} />
              </IconButton>
            </Card>
          }
        </List>
        <Box className='TaskListPlanning -new-task-wrapper'>
          {newTaskButtonVisible &&
            <Button onClick={newTaskButtonOnClick} className='TaskListPlanning -new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Task</Typography>
            </Button>
          }
        </Box>
      </Paper>
      {taskList &&
      <Modal
        open={taskListModalState}
        onClose={toggleTaskListModalState}
        className='TaskListPlanning -modal-wrapper'
      >
        <div className='TaskListPlanning -modal'>
          <TaskListModal listId={props.id} title={props.title} />
        </div>
      </Modal>
      }
      {props.title === 'Backlog' &&
        <Divider sx={{ mt: '32px', borderBottomWidth: 2, display: 'flex' }} />
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
