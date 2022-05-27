import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  InputBase,
  Skeleton,
  Avatar,
  Stack
} from '@mui/material'

import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import './TaskCardModal.sass'
import './task-card-modal/Markdown.sass'
import TaskComments from './task-card-modal/TaskComments'
import UserInfo from './task-card-modal/UserInfo'
import Tag from './Tag'
import PriorityIcon from './PriorityIcon'

import useTask from '../api/useTask'
import useCurrentUser from '../api/useCurrentUser'


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
  const { data: task, isLoading: isTaskLoading, isError: isTaskError } = useTask(props.taskId, { params: { includeAssociations: 'true' } })

  if (isTaskLoading || isTaskError || isCurrentUserLoading || isCurrentUserError) return (
    <TaskCardModalSkeleton />
  )

  return (
    <Box className='TaskCardModal-wrapper'>
      <Card className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Box className='TaskCardModal-main-label'>
            <Typography variant='h6'>
              {task.name}
              <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
            </Typography>
          </Box>
          <Typography>
              Description
            <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
          </Typography>
          <Card className='TaskCardModal-main-description markdown-text'>
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
                {task.priority ? <Box className='TaskCardModal-sidebar-card-box-taskPriority'>
                  <PriorityIcon size='xl' taskPriority={task.priority} />
                </Box> : null
                }
              </Stack>

              <Stack spacing={1}>
                <Typography>Points</Typography>
                {task.points ? <Avatar>{task.points}</Avatar> : null}
              </Stack>

              <Stack spacing={1}>
                <Typography>Tags</Typography>
                {task.tags.map((tag) => (
                  <Tag key={tag.id} name={tag.name} colour={tag.colour} />
                ))}
              </Stack>

              <Stack spacing={1}>
                <Typography>Assigned</Typography>
                {task.users.map((user) => (
                  <Box className='TaskCardModal-sidebar-card-box' key={user.id}>
                    <Avatar className='TaskCardModal-main-avatar'
                      alt={user.name} src={user.avatarUrl}
                    />
                    <UserInfo userName={user.name} userTitle={user.role} />
                  </Box>
                ))}
                <Box className='TaskCardModal-sidebar-card-box TaskCardModal-assign-user-btn'>
                  <Avatar className='TaskCardModal-main-avatar' alt='Add new user'>
                    <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPlus} />
                  </Avatar>
                  <UserInfo userName='Assign' />
                </Box>
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


