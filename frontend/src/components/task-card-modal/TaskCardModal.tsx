import * as React from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'

import {
  Typography,
  Box,
  Card,
  Avatar,
  Stack,
  IconButton,
  Button,
  Modal,
} from '@mui/material'
import { DeveloperContent, ManagerContent, RegularContent } from '../../permissions/content'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TaskComments from './task-comments/TaskComments'
import UserInfo from './UserInfo'
import Tag from '../Tag'
import AssignUserSelect from './AssignUserSelect'
import TaskLabel from './task-label/TaskLabel'
import TaskPriority from './task-priority/TaskPriority'
import TaskPoints from './task-points/TaskPoints'
import AttachTagSelect from './AttachTagSelect'
import TaskTime from './task-time/TaskTime'
import CustomAlert from '../custom-alert/CustomAlert'
import ScriptButton from '../script-button/ScriptButton'
import TaskCardModalSkeleton from './TaskCardModalSkeleton'
import type { TagShort, UserShort } from '../../types'

import { isRegular } from '../../internal/permissions'
import useTask from '../../api/task'
import apiClient from '../../api/axios-client'


import useAppAlertStore from '../../stores/app-alert'

interface Props {
  taskId: number
  boardId?: string | number
  workspaceId?: string | number
  closeModal: () => void
}

const TaskCardModal = ({ taskId, boardId, workspaceId, closeModal }: Props) => {
  const { data: task, isLoading: isTaskLoading, isError: isTaskError, mutate: mutateTask } = useTask({ id: taskId, axiosOptions: { params: { includeAssociations: 'true' } } })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)
  const [attachTagSelectVisible, setTagSelectVisible] = React.useState(false)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [taskDescriptionDraft, setTaskDescriptionDraft] = React.useState<string | undefined>(task?.description)
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const [duetime, setDuetime] = React.useState<Dayjs | null>(null)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }
  const updateTaskDescriptionDraft = (val: string | undefined) => {
    setTaskDescriptionDraft(val)
    setUnsavedDescriptionDraft(true)
  }

  const taskDescriptionOnClick = () => {
    setDescriptionEditorVisible(true)
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('.TaskCardModal-task-description-editor textarea')?.focus()
    }, 50)
  }

  const assignUserButtonOnClick = () => {
    setAssignUserSelectVisible(true)
    setTimeout(() => {
      document.getElementById('assign-user-to-task-select')?.focus()
    }, 50)
  }

  const assignUserSelectOnBlur = () => {
    setAssignUserSelectVisible(false)
  }

  const assignUserSelectOnChange = (e: React.SyntheticEvent, user: UserShort | null) => {
    if (user) assignUser(user)
    setAssignUserSelectVisible(false)
  }

  const assignUser = (user: UserShort) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/tasks/${taskId}/assign_user`, payload)
      .then((response) => {
        mutateTask({ ...task, users: [...(task?.users || []), user] } as any)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }
  const unassignUser = (user: UserShort) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/tasks/${taskId}/unassign_user`, payload)
      .then((response) => {
        const userIndex = task?.users?.findIndex((arrayUser) => arrayUser.id === user.id)
        if (userIndex == null || userIndex === -1) {
          mutateTask()
          return
        }

        const newTaskUsers = [...task.users]
        newTaskUsers.splice(userIndex, 1)
        mutateTask({ ...task, users: newTaskUsers } as any)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const attachTagButtonOnClick = () => {
    setTagSelectVisible(true)
    setTimeout(() => {
      document.getElementById('attach-tag-to-task-select')?.focus()
    }, 50)
  }

  const attachTagSelectOnBlur = () => {
    setTagSelectVisible(false)
  }

  const attachTagSelectOnChange = (e: React.SyntheticEvent, tag: TagShort | null) => {
    if (tag) attachTag(tag)
    setTagSelectVisible(false)
  }

  const attachTag = (tag: TagShort) => {
    const payload = { tagId: tag.id }

    apiClient.post(`/api/tasks/${taskId}/attach_tag`, payload)
      .then((response) => {
        mutateTask({ ...task, tags: [...(task?.tags || []), tag] } as any)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const detachTag = (e: React.MouseEvent, tag: TagShort) => {
    const payload = { tagId: tag.id }

    apiClient.post(`/api/tasks/${taskId}/detach_tag`, payload)
      .then((response) => {
        const tagsIndex = task?.tags?.findIndex((arrayTag) => arrayTag.id === tag.id)
        if (tagsIndex == null || tagsIndex === -1) {
          mutateTask()
          return
        }

        const newTaskTags = [...task.tags]
        newTaskTags.splice(tagsIndex, 1)
        mutateTask({ ...task, tags: newTaskTags } as any)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const createAttachTag = (newTagPayload: { name: string; color: string }) => {
    const payload = { ...newTagPayload, boardId, taskId }

    apiClient.post(`/api/tasks/${taskId}/tags`, payload)
      .then((response) => {
        const tagWithTempId = { ...payload, id: 99999999999 }
        mutateTask({ ...task, tags: [...(task?.tags || []), tagWithTempId] } as any)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (isTaskLoading || isTaskError) return (
    <TaskCardModalSkeleton />
  )

  const editTaskDescription = () => {
    const payload = { description: taskDescriptionDraft }

    apiClient.put(`/api/tasks/${taskId}`, payload)
      .then((response) => {
        mutateTask({ ...task, description: taskDescriptionDraft })
        setDescriptionEditorVisible(false)
        setUnsavedDescriptionDraft(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteTask = () => {
    apiClient.delete(`/api/tasks/${taskId}`)
      .then((response) => {
        addAlert({ severity: 'success', message: 'Task deleted!' })
        closeModal()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editDueTime = (value: Dayjs | null) => {
    if (!value || !value.isValid() || ((value.get('year') < 1900 || value.get('year') > 2099)) || (value.diff(task.dueTime, 'millisecond') === 0)) {
      setDuetime(value)
      return
    }
    const payload = { dueTime: value.format('YYYY-MM-DDTHH:mm:ssZ[Z]') }
    setDuetime(value)
    apiClient.put(`/api/tasks/${taskId}`, payload)
      .then((response) => {
        mutateTask({ ...task, dueTime: value.format('YYYY-MM-DDTHH:mm:ssZ[Z]') })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (taskDescriptionDraft == null && task?.description != null) setTaskDescriptionDraft(task.description)

  return (
    <Box data-color-mode='light' sx={{ overflowY: 'scroll', maxHeight: '100vh', msOverflowStyle: 'none', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Card sx={{ mt: 3, mb: 3, width: 'calc(100vw - 40px)', maxWidth: '1100px', display: 'flex', flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'space-between', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
        <Modal
          open={alertModalState}
          onClose={toggleAlertModalState}
        >
          <Box
            sx={{  position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              outline: 0 }}>
            <CustomAlert confirmAction={deleteTask}
              dismissAction={toggleAlertModalState}
              title='Delete Task?'
              message={`Are you sure you want to delete ${task.name}?`}
              confirmMessage='Confirm, delete task' />
          </Box>
        </Modal>
        <Box sx={{ width: '100%', m: 4 }}>
          <Box sx={{ mb: 4 }}>
            <TaskLabel task={task} mutate={mutateTask} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', alignContent: 'center', flexWrap: 'wrap', flexDirection: 'row', ml: -1, mr: -1 }}>
            <Typography sx={{ ml: 1, mr: 1 }}>
              Description
            </Typography>
            {unsavedDescriptionDraft ? (
              <Typography variant='caption' sx={{ color: '#7d7b7b', ml: 1, mr: 1 }}>
                Unsaved Changes
              </Typography>
            ) : null}
          </Box>
          {descriptionEditorVisible ? (
            <Box sx={{ mt: 1, mb: 5 }}>
              <MDEditor
                value={taskDescriptionDraft || ''}
                onChange={(val) => { updateTaskDescriptionDraft(val) }}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize] as any]
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', alignContent: 'flex-start', flexWrap: 'nowrap', flexDirection: 'row', pt: 1, pb: 1, ml: -0.5, mr: -0.5 }}>
                <Button variant='contained' color='primary' sx={{ mx: 0.5 }} onClick={() => editTaskDescription()}>Save</Button>
                <Button variant='text' sx={{ color: '#FF0000', mx: 0.5 }} onClick={() => setDescriptionEditorVisible(false)}>Cancel</Button>
              </Box>
            </Box>
          ) : (
            <Card
              sx={{ mt: 1, py: 1, px: 2, minHeight: '160px', mb: 5, cursor: 'pointer', transition: '.1s ease-in', '&:hover': { opacity: 0.8 } }}
              onClick={isRegular() ? taskDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                source={task.description || '###### Add a description...'}
                rehypePlugins={[[rehypeSanitize] as any]}
              />
            </Card>
          )}
          <Typography>
              Comments
          </Typography>
          <TaskComments taskId={task.id} />
        </Box>
        <Box sx={{ width: '360px', p: 4 }}>
          <Card sx={{ p: 2 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <DeveloperContent>
                  <ScriptButton scope='tasks' id={taskId} />
                </DeveloperContent>
                <Typography>Author</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: '32px', height: '32px', mr: 1 }}
                    alt={task.author.name} src={task.author.avatarUrl}
                  />
                  <UserInfo userName={task.author.name} userTitle={task.author.role} />
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Typography>Priority</Typography>
                <TaskPriority task={task} mutate={mutateTask} />
              </Stack>

              <Stack spacing={1}>
                <Typography>Points</Typography>
                <TaskPoints task={task} mutate={mutateTask} />
              </Stack>

              <Stack spacing={1}>
                <Typography>Due time</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    slotProps={{ textField: { onBlur: duetime ? () => editDueTime(duetime) : undefined } }}
                    ampm={false}
                    value={duetime ?? (task.dueTime ? dayjs(task.dueTime) : null)}
                    onChange={
                      (newValue) => {
                        setDuetime(newValue)
                      }}
                    onAccept={() => editDueTime(duetime)}
                  />
                </LocalizationProvider>
              </Stack>

              <Stack spacing={1}>
                <Typography>Tags</Typography>
                {task.tags.map((tag) => (
                  <Box key={tag.id} sx={{ mt: 0, mb: 1 }}>
                    <Tag
                      name={tag.name}
                      color={tag.color}
                      deletable={!!isRegular()}
                      onDelete={() => detachTag({} as React.MouseEvent, tag)}
                    />
                  </Box>
                ))}
                <RegularContent>
                  {attachTagSelectVisible ? (
                    <AttachTagSelect
                      onBlur={attachTagSelectOnBlur}
                      onChange={attachTagSelectOnChange}
                      createTag={createAttachTag}
                      addedTags={task.tags}
                      boardId={boardId}
                    />
                  ) : (
                    <Box
                      sx={{ color: '#7d7b7b', cursor: 'pointer', transition: '.1s ease-in', display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.8 } }}
                      onClick={attachTagButtonOnClick}
                    >
                      <Avatar alt='Add new user'>
                        <FontAwesomeIcon icon={faPlus} />
                      </Avatar>
                      <UserInfo userName='Add tag' />
                    </Box>
                  )}
                </RegularContent>
              </Stack>

              <Stack spacing={1}>
                <Typography>Time spent</Typography>
                <TaskTime task={task} mutate={mutateTask} />
              </Stack>

              <Stack spacing={1}>
                <Typography>Assigned</Typography>
                {task.users.map((user, userId) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }} key={userId}>
                    <Avatar sx={{ width: '32px', height: '32px', mr: 1 }}
                      alt={user.name} src={user.avatarUrl}
                    />
                    <UserInfo userName={user.name} userTitle={user.role} />
                    <ManagerContent>
                      <IconButton onClick={() => unassignUser(user)} sx={{ ml: 'auto' }}>
                        <FontAwesomeIcon style={{ width: '16px', height: '16px', color: '#FF0000' }} icon={faTrash} />
                      </IconButton>
                    </ManagerContent>
                  </Box>
                ))}
                <ManagerContent>
                  {assignUserSelectVisible ? (
                    <AssignUserSelect
                      onBlur={assignUserSelectOnBlur}
                      onChange={assignUserSelectOnChange}
                      assignedUsers={task.users}
                      workspaceId={workspaceId}
                    />
                  ) : (
                    <Box
                      sx={{ color: '#7d7b7b', cursor: 'pointer', transition: '.1s ease-in', display: 'flex', alignItems: 'center', '&:hover': { opacity: 0.8 } }}
                      onClick={assignUserButtonOnClick}
                    >
                      <Avatar alt='Add new user'>
                        <FontAwesomeIcon icon={faPlus} />
                      </Avatar>
                      <UserInfo userName='Assign' />
                    </Box>
                  )}
                </ManagerContent>
              </Stack>
            </Stack>
          </Card>
          <ManagerContent>
            <Button
              sx={{ width: '100%', mt: 2 }}
              variant='contained'
              color='error'
              onClick={toggleAlertModalState}>
              <Typography>Delete Task</Typography>
            </Button>
          </ManagerContent>
        </Box>
      </Card>
    </Box>
  )
}

export default TaskCardModal
