import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  InputBase,
  Skeleton,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material'

import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDispatch } from 'react-redux'

import './TaskCardModal.sass'
import './task-card-modal/Markdown.sass'
import TaskComments from './task-card-modal/TaskComments'
import UserInfo from './task-card-modal/UserInfo'
import Tag from './Tag'
import AssignUserSelect from './task-card-modal/AssignUserSelect'

import { addAlert } from '../redux/slices/appAlertSlice'
import useTask from '../api/useTask'
import useCurrentUser from '../api/useCurrentUser'
import apiClient from '../api/apiClient'
import TaskLabel from './task-card-modal/TaskLabel'
import TaskPriority from './task-card-modal/TaskPriority'
import TaskPoints from './task-card-modal/TaskPoints'

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
  const { data: currentUser, isLoading: isCurrentUserLoading, isError: isCurrentUserError } = useCurrentUser()
  const { data: task, isLoading: isTaskLoading, isError: isTaskError, mutate: mutateTask } = useTask(props.taskId, { params: { includeAssociations: 'true' } })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)
  const dispatch = useDispatch()

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
    const payload = {
      userId: user.id,
    }
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
    const payload = {
      userId: user.id,
    }
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

  if (isTaskLoading || isTaskError || isCurrentUserLoading || isCurrentUserError) return (
    <TaskCardModalSkeleton />
  )

  return (
    <Box className='TaskCardModal-wrapper'>
      <Card className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Box className='TaskCardModal-main-label'>
            <TaskLabel task={task} mutate={mutateTask} />
          </Box>
          <Typography>
              Description
            <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
          </Typography>
          <Card className='TaskCardModal-main-description-markdown-text'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {task.description}
            </ReactMarkdown>
          </Card>
          <Typography>
              Comments
          </Typography>
          <Card className='TaskCardModal-main-newComment'>
            <Avatar className='TaskCardModal-avatar'
              alt={currentUser.name} src={currentUser.avatarUrl}
            />
            <InputBase
              className='TaskCardModal-main-newComment-input'
              fullWidth
              multiline
              placeholder='Write a comment...'
            />
          </Card>
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
                    <Tag name={tag.name} colour={tag.colour} />
                  </Box>
                ))}
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
                    <IconButton onClick={() => unassignUser(user)} className='TaskCardModal-sidebar-user-unassinged'>
                      <FontAwesomeIcon className='TaskCardModal-sidebar-user-unassigned-icon' icon={faTrash} />
                    </IconButton>
                  </Box>
                ))}

                {assignUserSelectVisible ? (
                  <AssignUserSelect
                    onBlur={assignUserSelectOnBlur}
                    onChange={assignUserSelectOnChange} />
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
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Card>
    </Box>
  )
}


export default TaskCardModal


TaskCardModal.propTypes = {
  taskId: PropTypes.number.isRequired,
}


