import React, { useState } from 'react'

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
  Modal
} from '@mui/material'
import { ManagerContent } from '../../permissions/content'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ReactSortable } from 'react-sortablejs'

import { isRegular, isManager } from '../../internal/permissions'
import apiClient from '../../api/axios-client'
import useList from '../../api/list'
import { calculatePos, sortByPos } from '../../internal/component-position'
import useTaskDndStore from '../../stores/task-dnd'
import type { ListTask } from '../../types'

import TaskListModal from '../task-list-modal/TaskListModal'
import TaskCard from '../task-card/TaskCard'
import useAppAlertStore from '../../stores/app-alert'

interface Props {
  id: number
  index: number
  pos: number
  title: string
}

function TaskList({ id, title }: Props) {
  const { data: taskList, mutate } = useList({ id, axiosOptions: { params: { tasks: 'visible' } } })

  const [sortedTasks, setNewTaskOrder] = React.useState<ListTask[]>([])
  const draggedTaskId = useTaskDndStore((store) => store.draggedTaskId)
  const setDraggedTaskId = useTaskDndStore((store) => store.setDraggedTaskId)
  const clearDraggedTaskId = useTaskDndStore((store) => store.clearDraggedTaskId)

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

    const newSortedTasks = sortByPos(taskList.tasks!)
    setNewTaskOrder([...newSortedTasks])
  }, [taskList])

  const toggleNewTaskButton = () => setNewTaskButtonVisible(!newTaskButtonVisible)

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
      .then(() => {
        mutate((listData) => ({ ...listData!, tasks: updatedTasks }), { revalidate: false })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
        mutate()
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

    const currentTaskIndex = updatedTasks.findIndex((task) => task.id === draggedTaskId)

    if (currentTaskIndex === -1) {
      setNewTaskOrder(updatedTasks)
      mutate((listData) => ({ ...listData!, tasks: updatedTasks }), { revalidate: false })
      return
    }

    const newUpdatedTasks = [...updatedTasks]
    const newUpdatedTask = { ...newUpdatedTasks[currentTaskIndex] }
    newUpdatedTask.pos = calculatePos(currentTaskIndex, updatedTasks)
    newUpdatedTasks[currentTaskIndex] = newUpdatedTask

    updateTaskPos(newUpdatedTask.id, newUpdatedTask.pos, newUpdatedTasks)
  }

  return (
    <Box sx={{ m: 2 }} data-list-id={taskList?.id}>
      <Paper sx={{ width: '320px', maxHeight: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}
        elevation={5}>
        <List ref={listRef} sx={{ overflowY: 'auto' }}
          subheader={<ListSubheader sx={{ pt: 1, fontSize: '32px', display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
            <Typography
              sx={{ fontSize: '24px', width: '100%', display: 'block', mt: -1, pt: 1, ml: -2, pl: 2, mr: 1 }}
              style={{ cursor: isManager() ? 'grab' : undefined }}
            >
              {title}
            </Typography>
            <ManagerContent>
              <IconButton aria-label='Edit' color='secondary' onClick={toggleTaskListModalState}>
                <FontAwesomeIcon icon={faPencil} />
              </IconButton>
            </ManagerContent>
          </ListSubheader>} >
          {taskList ? (
            <div>
              {isRegular() ?
                <ReactSortable
                  onChoose={(event) => setDraggedTaskId((event.item as HTMLElement).dataset.taskId!)}
                  onEnd={clearDraggedTaskId}
                  list={sortedTasks}
                  setList={updateTaskOrder}
                  group='TaskCardList'
                  animation={50}
                  ghostClass='translucent'
                  selectedClass='translucent'
                  direction='horizontal'
                  scroll
                >
                  {sortedTasks.map((task, taskIndex) => (
                    <div key={taskIndex} data-task-id={task.id}>
                      <ListItem sx={{ width: '100%', p: 0.5 }}>
                        <TaskCard key={`${task.name}-${task.id}`}
                          id={task.id}
                          label={task.name}
                          tags={task.tags}
                          priority={task.priority}
                          assignedUsers={task.users}
                          points={task.points}
                          pos={task.pos}
                          index={taskIndex}
                          dueTime={task.dueTime ?? undefined}
                          listId={task.listId}
                        />
                      </ListItem>
                    </div>
                  ))}
                </ReactSortable> :
                <div>
                  {sortedTasks.map((task, taskIndex) => (
                    <div key={taskIndex}>
                      <ListItem sx={{ width: '100%', p: 0.5 }}>
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
                    </div>
                  ))}
                </div>
              }
            </div>
          ) : (
            <div></div>
          )}
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
            <Button onClick={newTaskButtonOnClick} sx={{ textTransform: 'none', justifyContent: 'flex-start', width: '100%' }} color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
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
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 0 }}>
          <TaskListModal listId={id} title={title} listVisibility={'visible'} />
        </Box>
      </Modal>
      }
    </Box>
  )
}

export default TaskList
