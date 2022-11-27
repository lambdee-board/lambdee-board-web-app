import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
import { ManagerContent } from '../permissions/content'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

import { isManager, isRegular } from '../internal/permissions'
import apiClient from '../api/api-client'
import useList from '../api/list'
import { calculatePos } from '../internal/component-position-service'
import useAppAlertStore from '../stores/app-alert'

import TaskListModal from './TaskListModal'
import { TaskCardSkeleton } from './TaskCard'
import TaskCardListItem from './TaskCardListItem'
import SortableTaskCardListItem from './SortableTaskCardListItem'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import './TaskList.sass'

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

const TaskList = React.forwardRef((props, ref) => {
  const { data: taskList, mutate } = useList({
    id: props.id,
    axiosOptions: { params: { tasks: 'visible' } },
    options: {
      revalidateOnMount: !props.dragged,
    }
  })

  const [sortedTasks, setNewTaskOrder] = React.useState([])

  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()
  const addAlert = useAppAlertStore((store) => store.addAlert)

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
        addAlert({ severity: 'error', message: 'Something went wrong!' })
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
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
      .finally(() => {
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
    <div ref={ref} style={props.style} className='TaskList-wrapper'>
      <Paper className='TaskList-paper'
        elevation={5}>
        <List ref={listRef} className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Typography
              className='TaskList-header-text'
              ref={props.listDragHandleRef}
              style={{ cursor: isManager() ? 'grab' : undefined }}
              {...(props.dndAttributes ?? {})}
              {...(props.dndListeners ?? {})}
            >
              {props.title}
            </Typography>
            <ManagerContent>
              <IconButton aria-label='Edit' color='secondary' onClick={toggleTaskListModalState}>
                <FontAwesomeIcon icon={faPencil} />
              </IconButton>
            </ManagerContent>
          </ListSubheader>} >
          <div>
            {isRegular() ?
              <SortableContext
                id={`tasks-${props.id}`}
                items={sortedTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedTasks.map((task, taskIndex) => (
                  <SortableTaskCardListItem
                    key={task.id}
                    id={task.id}
                    label={task.name}
                    tags={task.tags}
                    priority={task.priority}
                    assignedUsers={task.users}
                    points={task.points}
                    pos={task.pos}
                    index={taskIndex}
                    listId={task.listId}
                  />))}
              </SortableContext>      :
              sortedTasks.map((task, taskIndex) => (
                <TaskCardListItem key={task.id}
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
              ))}
          </div>
          <ManagerContent>
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
          </ManagerContent>
        </List>
        <ManagerContent>
          <Box className='TaskList-new-task-wrapper'>
            {newTaskButtonVisible &&
              <Button onClick={newTaskButtonOnClick} className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
                <Typography>New Task</Typography>
              </Button>
            }

          </Box>
        </ManagerContent>
      </Paper>
      {taskList &&
        <Modal
          open={taskListModalState}
          onClose={toggleTaskListModalState}
          className='TaskList-modal-wrapper'
        >
          <div className='TaskList-modal'>
            <TaskListModal listId={props.id} title={props.title} listVisibility={'visible'} />
          </div>
        </Modal>
      }
    </div>
  )
})

TaskList.displayName = 'TaskList'
TaskList.propTypes = {
  id: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  dndAttributes: PropTypes.object,
  dndListeners: PropTypes.object,
  dragged: PropTypes.bool,
  listDragHandleRef: PropTypes.func,
  style: PropTypes.object
}

export default TaskList
export { TaskList, TaskListSkeleton }
