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
  Card,
  InputBase,
  Modal,
  Divider
} from '@mui/material'
import { ManagerContent } from '../../../permissions/content'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { ReactSortable } from 'react-sortablejs'

import { isRegular } from '../../../internal/permissions'
import apiClient from '../../../api/axios-client'
import useList from '../../../api/list'
import { mutateBoard } from '../../../api/board'
import { calculatePos } from '../../../internal/component-position'
import useAppAlertStore from '../../../stores/app-alert'
import type { ListTask } from '../../../types'

import TaskListModal from '../../task-list-modal/TaskListModal'
import TaskListItem from '../task-list-item/TaskListItem'
import TaskPlanningListSkeleton from './TaskPlanningListSkeleton'

import './TaskPlanningList.sass'

interface Props {
  id: number
  index: number
  pos: number
  title: string
  visible: boolean
}

function TaskPlanningList({ id, title }: Props) {
  const { boardId } = useParams()
  const { data: taskList, mutate } = useList({ id, axiosOptions: { params: { tasks: 'visible' } } })

  const [sortedTasks, setNewTaskOrder] = React.useState<ListTask[]>([])
  const [newTaskButtonVisible, setNewTaskButtonVisible] = React.useState(true)
  const listRef = React.useRef<HTMLUListElement>(null)
  const newTaskInputRef = React.useRef<HTMLDivElement>(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)

  const [taskListModalState, setTaskListModalState] = useState(false)
  const toggleTaskListModalState = () => {
    setTaskListModalState(!taskListModalState)
  }

  React.useEffect(() => {
    if (!taskList) return

    const newSortedTasks = [...taskList.tasks!]?.sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskOrder([...newSortedTasks])
  }, [taskList])

  const toggleNewTaskButton = () => setNewTaskButtonVisible(!newTaskButtonVisible)

  const toggleListVisibility = () => {
    const payload = { visible: !taskList!.visible }

    apiClient.put(`/api/lists/${id}`, payload)
      .then((response) => {
        mutate({ ...taskList!, visible: payload.visible }, { revalidate: false })
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const newTaskButtonOnClick = () => {
    toggleNewTaskButton()
    setTimeout(() => {
      if (!listRef.current || !newTaskInputRef.current) return

      const currentList = listRef.current
      currentList.scrollTop = currentList.scrollHeight + 200
      const nameInput = newTaskInputRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const createNewTask = () => {
    const nameInput = newTaskInputRef.current!.children[0] as HTMLInputElement
    const newTask = {
      name: nameInput.value,
      listId: id,
      authorId: parseInt(localStorage.getItem('id')!),
    }
    apiClient.post('/api/tasks', newTask)
      .then((response) => {
        mutate({ ...taskList!, tasks: [...(taskList?.tasks || []), response.data] }, { revalidate: false })
        nameInput.value = ''
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const newTaskNameInputOnKey = (e: React.KeyboardEvent) => {
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

  const updateTaskPos = (taskId: number, newPos: number, updatedTasks: ListTask[]) => {
    setNewTaskOrder(updatedTasks)

    const updatedTask = {
      id: taskId,
      listId: id,
      pos: newPos,
    }

    apiClient.put(`/api/tasks/${taskId}`, updatedTask)
      .then((response) => {
        mutate((listData) => ({ ...listData!, tasks: updatedTasks }), { revalidate: false })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const updateTaskOrder = (updatedTasks: ListTask[]) => {
    if (updatedTasks.length === sortedTasks.length) {
      let tasksAreEqual = true
      for (let i = 0; i < sortedTasks.length; i++) {
        if (sortedTasks[i].id !== updatedTasks[i].id) {
          tasksAreEqual = false
          break
        }
      }

      if (tasksAreEqual) return
    }

    const currentTaskIndex = updatedTasks.findIndex((list) => (list as unknown as { chosen?: unknown }).chosen !== undefined)

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

  if (!taskList) return <TaskPlanningListSkeleton />

  return (
    <Box className='TaskListPlanning-wrapper'>
      <Paper className='TaskListPlanning-paper' sx = {!taskList?.visible ? { opacity: '0.8' } : undefined}
        elevation={5}>
        <List ref={listRef} className='TaskListPlanning'
          subheader={<ListSubheader
            className='TaskListPlanning-header'
            style={{ cursor: taskList?.visible ? 'grab' : undefined }}
          >
            <Typography className='TaskListPlanning-header-text'>
              {title}
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
          </ListSubheader>}>
          <Card sx={{ pl: '4px', pr: '4px', ml: '8px', mr: '8px' }}>
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
                  scroll
                >
                  {sortedTasks.map((task, taskIndex) => (
                    <div key={taskIndex}>
                      <ListItem className='TaskListPlanning-item'>
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
                          dueTime={task.dueTime ?? undefined}
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
                </ReactSortable> :
                <div>
                  {sortedTasks.map((task, taskIndex) => (
                    <div key={taskIndex}>
                      <ListItem className='TaskListPlanning-item'>
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
                onBlur={() => toggleNewTaskButton()}
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
      <Modal
        open={taskListModalState}
        onClose={toggleTaskListModalState}
        className='TaskList-modal-wrapper'
      >
        <div className='TaskList-modal'>
          <TaskListModal listId={id} title={title} listVisibility={'non-archived'} />
        </div>
      </Modal>
    </Box>
  )
}

export default TaskPlanningList
