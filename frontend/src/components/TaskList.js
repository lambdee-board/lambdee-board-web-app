import React, { useCallback, } from 'react'
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
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import apiClient from '../api/apiClient'

import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'
import { TaskCardSkeleton, TaskCard } from './TaskCard'
import useList, { mutateList } from '../api/useList'

import './TaskList.sass'
import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import TaskDropZone from './TaskDropZone'


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
  const { data: taskList, mutate } = useList(props.id, { params: { tasks: 'all' } })

  const [sortedTasks, setNewTaskOrder] = React.useState([])
  const dndRef = React.useRef(null)
  const dndPreviewRef = React.useRef(null)
  const [moveList, updateListPos] = props.dndFun

  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()
  const dispatch = useDispatch()


  React.useEffect(() => {
    if (taskList) {
      const sortedTasksList = [...taskList.tasks].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      setNewTaskOrder([...sortedTasksList])
    }
  }, [taskList])

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.TASKLIST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop(item, monitor) {
      updateListPos(item.index, props.index)
    },
    hover(item, monitor)  {
      if (!dndRef.current) return

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return


      const hoveredRect = dndRef.current?.getBoundingClientRect()
      const hoverMiddleX = (hoveredRect.right - hoveredRect.left) / 2
      const mousePosition = monitor.getClientOffset()
      const hoverClientX = mousePosition.x - hoveredRect.left


      if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) return

      if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) return

      moveList(dragIndex, hoverIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.TASKLIST,
    item: {
      id: props.id,
      name: props.title,
      index: props.index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })


  const moveTaskInList = React.useCallback((dragIndex, hoverIndex) => {
    setNewTaskOrder((prevState) => {
      const newState = update(prevState,
        { $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevState[dragIndex]],
        ], })

      if (hoverIndex === 0) {
        newState[hoverIndex].pos = newState[1].pos / 2
      } else if (hoverIndex === newState.length - 1) {
        newState[hoverIndex].pos = newState.at(-2).pos + 1024
      } else {
        newState[hoverIndex].pos = (newState[hoverIndex - 1].pos + newState[hoverIndex + 1].pos) / 2
      }
      return newState
    })
  },
  [])

  const updateTaskPos = useCallback((dragIndex, hoverIndex) => {
    const taskId = sortedTasks[dragIndex].id
    const newPos = sortedTasks[dragIndex].pos

    const updatedTask = {
      id: taskId,
      pos: newPos,
    }
    apiClient.put(`/api/tasks/${taskId}`, updatedTask)
      .then((response) => {})
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }, [dispatch, sortedTasks])


  drag(drop(dndRef))
  dragPreview(dndPreviewRef)


  const assignTaskToNewList = (item, newListId) => {
    const index = item.idxInNewList
    let newPos = null
    if (sortedTasks.length > 0) {
      if (index === 0) {
        newPos = sortedTasks[0].pos / 2
      } else if (index === sortedTasks.length - 1) {
        newPos = sortedTasks.at(-1).pos + 1024
      } else {
        newPos = (sortedTasks[index].pos + sortedTasks[index + 1].pos) / 2
      }
    }

    const updateTask = {
      listId: newListId,
      pos: newPos || item.pos
    }
    apiClient.put(`/api/tasks/${item.id}`, updateTask)
      .then((response) => {
        // successful request
        mutateList(item.listId, { params: { tasks: 'all' } })
        mutateList(newListId, { params: { tasks: 'all' } })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


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
        console.log(error)
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
      <Paper className='TaskList-paper' ref={dndPreviewRef} sx={{ opacity: isDragging ? 0 : 1 }} data-handler-id={handlerId}
        elevation={5}>
        <List ref={listRef} className='TaskList'
          subheader={<ListSubheader ref={dndRef} className='TaskList-header' >
            <Typography className='TaskList-header-text' >
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary'>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          {taskList ? (<TaskDropZone listId={props.id} dndFun={[assignTaskToNewList]}>
            {
              sortedTasks.map((task, taskIndex) => (
                <ListItem className='TaskList-item' key={taskIndex} >
                  <TaskCard key={`${task.name}-${task.id}`}
                    id={task.id}
                    taskLabel={task.name}
                    taskTags={task.tags}
                    taskPriority={task.priority}
                    assignedUsers={task.users}
                    taskPoints={task.points}
                    index={taskIndex}
                    parentIndex={task.listId}
                    pos={task.pos}
                    dndFun={[moveTaskInList, updateTaskPos]}
                  />
                </ListItem>
              ))}
          </TaskDropZone>
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
    </Box>
  )
}

TaskList.propTypes = {
  dndFun: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default TaskList
export { TaskList, TaskListSkeleton }
