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
    <Box>
      <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', mt: 3, bgcolor: 'primary.light', ...(taskList?.visible ? {} : { opacity: 0.8 }) }}
        elevation={5}>
        <List ref={listRef} sx={{ overflowY: 'auto' }}
          subheader={<ListSubheader
            sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', lineHeight: '0px', bgcolor: 'primary.light' }}
            style={{ cursor: taskList?.visible ? 'grab' : undefined }}
          >
            <Typography variant='body1' sx={{ pt: 0.75 }}>
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
          <Card sx={{ px: 0.5, mx: 1 }}>
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
                      <ListItem sx={{ width: '100%', p: 0.5 }}>
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
                      <ListItem sx={{ width: '100%', p: 0.5 }}>
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
            <Card sx={{ py: 0.75, px: 1, my: 0.75, mx: 1, display: 'flex' }}>
              <InputBase
                ref={newTaskInputRef}
                sx={{ mr: 'auto' }}
                fullWidth
                multiline
                placeholder='Task Label'
                onKeyDown={(e) => newTaskNameInputOnKey(e)}
                onBlur={() => toggleNewTaskButton()}
              />
              <IconButton sx={{ margin: 'auto', color: '#DCDCDC' }} onClick={() => toggleNewTaskButton()}>
                <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faXmark} />
              </IconButton>
            </Card>
            }
          </ManagerContent>
        </List>
        <ManagerContent>
          <Box>
            {newTaskButtonVisible &&
            <Button sx={{ pt: 0, textTransform: 'none', justifyContent: 'flex-start', width: '100%' }} onClick={newTaskButtonOnClick} color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Task</Typography>
            </Button>
            }
          </Box>
        </ManagerContent>
      </Paper>
      <Modal
        open={taskListModalState}
        onClose={toggleTaskListModalState}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 0 }}>
          <TaskListModal listId={id} title={title} listVisibility={'non-archived'} />
        </Box>
      </Modal>
    </Box>
  )
}

export default TaskPlanningList
