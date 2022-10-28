import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  Divider
} from '@mui/material'
import { ManagerContent } from './../../permissions/ManagerContent'
import { isRegular } from './../../permissions/RegularContent'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { ReactSortable } from 'react-sortablejs'

import apiClient from '../../api/apiClient'
import TaskListItem from './TaskListItem'
import useList from '../../api/useList'
import { mutateBoard } from '../../api/useBoard'

import { calculatePos } from '../../constants/componentPositionService'

import './TaskPlanningList.sass'
import { addAlert } from '../../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import TaskListModal from '../TaskListModal'


function TaskPlanningListSkeleton() {
  return (
    <Box className='TaskListPlanning-wrapper'>
      <Paper className='TaskListPlanning-paper'
        elevation={5}>
        <List className='TaskListPlanning'
          subheader={<ListSubheader className='TaskListPlanning-header' >
            <Typography className='TaskListPlanning-header-text'   >
              <Skeleton height={36} width={200} />
            </Typography>
          </ListSubheader>} >
          <Card sx={{ pl: '4px', pr: '4px', ml: '8px', mr: '8px'  }}>
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


function TaskPlanningList(props) {
  const { boardId } = useParams()
  const { data: taskList, mutate } = useList({ id: props.id, axiosOptions: { params: { tasks: 'visible' } } })


  const [sortedTasks, setNewTaskOrder] = React.useState([])
  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  // visibility should part of props
  const listRef = React.useRef()
  const newTaskInputRef = React.useRef()
  const dispatch = useDispatch()

  const [taskListModalState, setTaskListModalState] = useState(false)
  const toggleTaskListModalState = () => {
    setTaskListModalState(!taskListModalState)
  }


  React.useEffect(() => {
    if (!taskList) return

    const newSortedTasks = [...taskList.tasks]?.sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskOrder([...newSortedTasks])
  }, [taskList])


  const toggleNewTaskButton = () => setNewTaskButtonVisible(!newTaskButtonVisible)

  const toggleListVisibility = (e) => {
    const payload = { visible: !taskList.visible }

    apiClient.put(`/api/lists/${props.id}`, payload)
      .then((response) => {
        // successful request
        mutate({ ...taskList, visible: payload.visible })
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

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
      return
    }

    const newUpdatedTasks = [...updatedTasks]
    const newUpdatedTask = { ...newUpdatedTasks[currentTaskIndex] }
    newUpdatedTask.pos = calculatePos(currentTaskIndex, updatedTasks)
    newUpdatedTasks[currentTaskIndex] = newUpdatedTask

    updateTaskPos(newUpdatedTask.id, newUpdatedTask.pos, newUpdatedTasks)
  }
  return (

    <Box className='TaskListPlanning-wrapper'>

      <Paper className='TaskListPlanning-paper' sx = {!taskList?.visible ? { opacity: '0.6' } : null}
        elevation={5}>
        <List ref={listRef} className='TaskListPlanning'
          subheader={<ListSubheader className='TaskListPlanning-header' >
            <Typography className='TaskListPlanning-header-text'   >
              {props.title}
            </Typography>
            <ManagerContent>
              <div>
                <IconButton aria-label='Visibility' color='secondary' onClick={toggleListVisibility}>
                  {taskList?.visible ?
                    <FontAwesomeIcon className='TaskListPlanning-header-icon' icon={faEye} /> :
                    <FontAwesomeIcon className='TaskListPlanning-header-icon' icon={faEyeSlash} />
                  }
                </IconButton>
                <IconButton aria-label='Edit' color='secondary' onClick={toggleTaskListModalState}>
                  <FontAwesomeIcon className='TaskListPlanning-header-icon' icon={faPencil} />
                </IconButton>
              </div>
            </ManagerContent>
          </ListSubheader>} >
          <Card sx={{ pl: '4px', pr: '4px', ml: '8px', mr: '8px'  }}>
            {taskList ? (
              <div>
                {isRegular() ?
                  <ReactSortable
                    list={sortedTasks}
                    setList={updateTaskOrder}
                    group='TaskCardList'
                    delay={1}
                    animation={50}
                    ghostClass='translucent'
                    selectedClass='translucent'
                    direction='horizontal'
                    // multiDrag
                    scroll
                  >

                    {sortedTasks.map((task, taskIndex) => (
                      <div key={taskIndex}>
                        <ListItem className='TaskListPlanning-item' >
                          <TaskListItem key={`${task.name}-${task.id}`}
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
                        <Divider />
                      </div>
                    ))}
                  </ReactSortable> :
                  <div>
                    {sortedTasks.map((task, taskIndex) => (
                      <div key={taskIndex}>
                        <ListItem className='TaskListPlanning-item' >
                          <TaskListItem key={`${task.name}-${task.id}`}
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
                        <Divider />
                      </div>
                    ))}
                  </div>
                }
              </div>
            ) : (
              <div></div>
            )}
          </Card>
          <ManagerContent>
            { !newTaskButtonVisible &&
            <Card
              className='TaskListPlanning-new-task'>
              <InputBase
                ref={newTaskInputRef}
                className='TaskListPlanning-new-task-input'
                fullWidth
                multiline
                placeholder='Task Label'
                onKeyDown={(e) => newTaskNameInputOnKey(e)}
                onBlur={(e) => toggleNewTaskButton()}
              />
              <IconButton className='TaskListPlanning-new-task-cancel' onClick={() => toggleNewTaskButton()}>
                <FontAwesomeIcon className='TaskListPlanning-new-task-cancel-icon' icon={faXmark} />
              </IconButton>
            </Card>
            }
          </ManagerContent>
        </List>
        <ManagerContent>
          <Box className='TaskListPlanning-new-task-wrapper'>
            {newTaskButtonVisible &&
            <Button sx={{ pt: '0px' }} onClick={newTaskButtonOnClick} className='TaskListPlanning-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
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
          <TaskListModal listId={props.id} title={props.title} listVisibility={'non-archived'}  />
        </div>
      </Modal>
      }
    </Box>
  )
}

TaskPlanningList.propTypes = {
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
}

export default TaskPlanningList
export { TaskPlanningList, TaskPlanningListSkeleton }
