import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  Skeleton,
  Avatar,
  Stack,
  IconButton,
  Button,
} from '@mui/material'
import { RegularContent, isRegular } from '../permissions/RegularContent'
import { ManagerContent } from '../permissions/ManagerContent'

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { useDispatch } from 'react-redux'

import './TaskCardModal.sass'
import TaskComments from './task-card-modal/TaskComments'
import UserInfo from './task-card-modal/UserInfo'
import Tag from './Tag'
import AssignUserSelect from './task-card-modal/AssignUserSelect'

import { addAlert } from '../redux/slices/appAlertSlice'
import useTask from '../api/useTask'
import apiClient from '../api/apiClient'
import TaskLabel from './task-card-modal/TaskLabel'
import TaskPriority from './task-card-modal/TaskPriority'
import TaskPoints from './task-card-modal/TaskPoints'
import AttachTagSelect from './task-card-modal/AttachTagSelect'
import { useParams } from 'react-router-dom'
import TaskTime from './task-card-modal/TaskTime'


function TaskCardModalSkeleton() {
  return (
    <Box className='TaskCardModal-wrapper'>
      <Card className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Skeleton height={50} width={200} />
          <Skeleton height={40} width={100} />
          <Card className='TaskCardModal-main-description'>
            <Skeleton height={40} width={100} />
            <Skeleton height={20} width={300} />
            <Skeleton height={20} width={250} />
            <Skeleton height={20} width={150} />
          </Card>
          <Skeleton height={40} width={100} />
          <Card className='TaskCardModal-main-newComment'>
            <Skeleton variant='circular' className='TaskCardModal-avatar' />
            <Skeleton width={200} />
          </Card>
        </Box>
        <Box className='TaskCardModal-sidebar'>
          <Card className='TaskCardModal-sidebar-card'>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Box className='TaskCardModal-sidebar-card-box'>
                  <Skeleton variant='circular' height={40} width={40} className='TaskCardModal-avatar' />
                  <div>
                    <Skeleton height={30} width={50} />
                    <Skeleton height={15} width={30} />
                  </div>
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='circular' height={40} width={40} />
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='circular' height={40} width={40} />
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Card>
    </Box>
  )
}


const TaskCardModal = (props) => {
  // TODO: User id should be derived from a Cookie
  const { data: task, isLoading: isTaskLoading, isError: isTaskError, mutate: mutateTask } = useTask({ id: props.taskId, axiosOptions: { params: { includeAssociations: 'true' } } })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)
  const [attachTagSelectVisible, setTagSelectVisible] = React.useState(false)
  const dispatch = useDispatch()
  const [taskDescriptionDraft, setTaskDescriptionDraft] = React.useState(task?.description)
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)

  const { boardId } = useParams()

  const updateTaskDescriptionDraft = (val) => {
    setTaskDescriptionDraft(val)
    setUnsavedDescriptionDraft(true)
  }

  const taskDescriptionOnClick = () => {
    setDescriptionEditorVisible(true)
    setTimeout(() => {
      document.querySelector('.TaskCardModal-task-description-editor textarea').focus()
    }, 50)
  }

  const assignUserButtonOnClick = () => {
    setAssignUserSelectVisible(true)
    setTimeout(() => {
      document.getElementById('assign-user-to-task-select').focus()
    }, 50)
  }

  const assignUserSelectOnBlur = () => {
    setAssignUserSelectVisible(false)
  }

  const assignUserSelectOnChange = (e, user) => {
    assignUser(user)
    setAssignUserSelectVisible(false)
  }

  const assignUser = (user) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/tasks/${props.taskId}/assign_user`, payload)
      .then((response) => {
        // successful request
        mutateTask({ ...task, users: [...task?.users || [], user] })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }
  const unassignUser = (user) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/tasks/${props.taskId}/unassign_user`, payload)
      .then((response) => {
        // successful request
        const userIndex = task?.users?.findIndex((arrayUser) => arrayUser.id === user.id)
        if (userIndex == null || userIndex === -1) { // unassigned user is not present in the list of assigned users
          mutateTask()
          return
        }

        const newTaskUsers = [...task.users]
        newTaskUsers.splice(userIndex, 1) // delete the unassigned user from the list
        mutateTask({ ...task, users: newTaskUsers })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  const attachTagButtonOnClick = () => {
    setTagSelectVisible(true)
    setTimeout(() => {
      document.getElementById('attach-tag-to-task-select').focus()
    }, 50)
  }

  const attachTagSelectOnBlur = () => {
    setTagSelectVisible(false)
  }

  const attachTagSelectOnChange = (e, tag) => {
    attachTag(tag)
    setTagSelectVisible(false)
  }

  const attachTag = (tag) => {
    const payload = { tagId: tag.id }

    apiClient.post(`/api/tasks/${props.taskId}/attach_tag`, payload)
      .then((response) => {
        // successful request
        mutateTask({ ...task, tags: [...task?.tags || [], tag] })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const detachTag = (e, tag) => {
    const payload = { tagId: tag.id }

    apiClient.post(`/api/tasks/${props.taskId}/detach_tag`, payload)
      .then((response) => {
        // successful request
        const tagsIndex = task?.tags?.findIndex((arrayTag) => arrayTag.id === tag.id)
        if (tagsIndex == null || tagsIndex === -1) {
          mutateTask()
          return
        }

        const newTaskTags = [...task.tags]
        newTaskTags.splice(tagsIndex, 1)
        mutateTask({ ...task, tags: newTaskTags })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const createAttachTag = (newTagPayload) => {
    const payload = { ...newTagPayload, boardId, taskId: props.taskId }

    apiClient.post(`/api/tasks/${props.taskId}/tags`, payload)
      .then((response) => {
        // successful request
        const tagWithTempId = { ...payload, id: 99999999999 }
        mutateTask({ ...task, tags: [...task?.tags || [], tagWithTempId] })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  if (isTaskLoading || isTaskError) return (
    <TaskCardModalSkeleton />
  )

  const editTaskDescription = () => {
    const payload = { description: taskDescriptionDraft }

    apiClient.put(`/api/tasks/${props.taskId}`, payload)
      .then((response) => {
        // successful request
        mutateTask({ ...task, description: taskDescriptionDraft })
        setDescriptionEditorVisible(false)
        setUnsavedDescriptionDraft(false)
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const deleteTask = () => {
    apiClient.delete(`/api/tasks/${props.taskId}`)
      .then((response) => {
        dispatch(addAlert({ severity: 'success', message: 'Task deleted!' }))
        props.closeModal()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  if (taskDescriptionDraft == null && task?.description != null) setTaskDescriptionDraft(task.description)

  return (
    <Box className='TaskCardModal-wrapper' data-color-mode='light'>
      <Card className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Box className='TaskCardModal-main-label'>
            <TaskLabel task={task} mutate={mutateTask} />
          </Box>
          <div className='TaskCardModal-description-label'>
            <Typography>
              Description
            </Typography>
            {unsavedDescriptionDraft ? (
              <Typography className='TaskCardModal-description-label-unsaved-changes' variant='caption'>
                Unsaved Changes
              </Typography>
            ) : null}
          </div>
          {descriptionEditorVisible ? (
            <div className='TaskCardModal-task-description-editor'>
              <MDEditor
                value={taskDescriptionDraft || ''}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]]
                }}
              />
              <div className='buttons'>
                <Button
                  variant='contained'
                  onClick={() => editTaskDescription()}
                >
                  Save
                </Button>
                <Button
                  variant='text'
                  color='secondary'
                  onClick={() => setDescriptionEditorVisible(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (

            <Card
              className='TaskCardModal-main-description'
              onClick={isRegular() ? taskDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                source={task.description || '###### Add a description...'}
                rehypePlugins={[[rehypeSanitize]]}
              />
            </Card>


          )}
          <Typography>
              Comments
          </Typography>
          <TaskComments taskId={task.id} />
        </Box>
        <Box className='TaskCardModal-sidebar'>
          <Card className='TaskCardModal-sidebar-card'>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography>Author</Typography>
                <Box className='TaskCardModal-sidebar-card-box'>
                  <Avatar className='TaskCardModal-main-avatar'
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
                <Typography>Tags</Typography>
                {task.tags.map((tag) => (
                  <Box key={tag.id} className='TaskCardModal-sidebar-card-box-tags'>
                    <Tag
                      name={tag.name}
                      colour={tag.colour}
                      deletable={!!isRegular()}
                      onDelete={(event) => detachTag(event, tag)}
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
                    />
                  ) : (
                    <Box
                      className='TaskCardModal-sidebar-card-box TaskCardModal-add-tag-btn TaskCardModal-assign-user-btn'
                      onClick={attachTagButtonOnClick}
                    >
                      <Avatar className='TaskCardModal-main-avatar' alt='Add new user'>
                        <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPlus} />
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
                  <Box className='TaskCardModal-sidebar-card-box'
                    key={userId}>
                    <Avatar className='TaskCardModal-main-avatar'
                      alt={user.name} src={user.avatarUrl}
                    />
                    <UserInfo userName={user.name} userTitle={user.role} />
                    <ManagerContent>
                      <IconButton onClick={() => unassignUser(user)} className='TaskCardModal-sidebar-user-unassinged'>
                        <FontAwesomeIcon className='TaskCardModal-sidebar-user-unassigned-icon' icon={faTrash} />
                      </IconButton>
                    </ManagerContent>
                  </Box>
                ))}
                <RegularContent>
                  {assignUserSelectVisible ? (
                    <AssignUserSelect
                      onBlur={assignUserSelectOnBlur}
                      onChange={assignUserSelectOnChange}
                      assignedUsers={task.users}
                    />
                  ) : (
                    <Box
                      className='TaskCardModal-sidebar-card-box TaskCardModal-assign-user-btn'
                      onClick={assignUserButtonOnClick}
                    >
                      <Avatar className='TaskCardModal-main-avatar' alt='Add new user'>
                        <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPlus} />
                      </Avatar>
                      <UserInfo userName='Assign' />
                    </Box>
                  )}
                </RegularContent>
              </Stack>
            </Stack>
          </Card>
          <RegularContent>
            <Button
              className='TaskCardModal-delete-task'
              variant='contained'
              color='error'
              onClick={() => deleteTask()}>
              <Typography>Delete Task</Typography>
            </Button>
          </RegularContent>
        </Box>
      </Card>
    </Box>
  )
}


export default TaskCardModal


TaskCardModal.propTypes = {
  taskId: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired
}


