import React, { useRef } from 'react'
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
  InputBase
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import apiClient from '../api/apiClient'

import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'
import { TaskCardSkeleton } from './TaskCard'

import './TaskList.sass'
import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'

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
    </Box>
  )
}

function TaskList(props) {
  const ref = useRef(null)
  const [moveList] = props.dndFun


  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.TASKLIST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor)  {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return


      const hoveredRect = ref.current?.getBoundingClientRect()
      const hoverMiddleX = (hoveredRect.right - hoveredRect.left) / 2
      const mousePosition = monitor.getClientOffset()
      const hoverClientX = mousePosition.x - hoveredRect.left


      if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) return

      if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) return

      moveList(dragIndex, hoverIndex)
      // changeListPos(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
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

  drag(drop(ref))

  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()
  const dispatch = useDispatch()

  const toggleNewTaskButton = () => setNewTaskButtonVisible(!newTaskButtonVisible)

  const handleNewTaskClick = () => {
    toggleNewTaskButton()
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
      listId: props.id,
      authorId: 1, // TODO: these values should be fetched
    }
    apiClient.post('/api/tasks', newTask)
      .then((response) => {
        // successful request
        dispatch(addAlert({ severity: 'success', message: 'Udało się dodać zadanie!' }))
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Nie udało się dodać zadanie!' }))
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
      <Paper className='TaskList-paper' ref={(ref)} sx={{ opacity: isDragging ? 0 : 1 }} data-handler-id={handlerId}
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
  children: PropTypes.array.isRequired,
  dndFun: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default TaskList
export { TaskList, TaskListSkeleton }
