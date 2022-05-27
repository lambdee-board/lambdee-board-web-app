import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  InputBase,
  IconButton,
  Skeleton,
  Avatar,
  Stack
} from '@mui/material'

import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import './TaskCardModal.sass'
import './task-card-modal/Markdown.sass'
import ModalComment from './task-card-modal/ModalComment'
import UserInfo from './task-card-modal/UserInfo'
import AvatarPopover from './task-card-modal/AvatarPopover'
import Tag from './Tag'
import PriorityIcon from './PriorityIcon'

import useTask from '../api/useTask'
import useCurrentUser from '../api/useCurrentUser'


function TaskCardModalSkeleton() {
  return (
    <Box className='TaskCardModal-wrapper'>
      <Box className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Card className='TaskCardModal-main-description'>
            <Skeleton height={200}></Skeleton>
          </Card>
          <Skeleton height={50} />
          <Card className='TaskCardModal-main-newComment'>
            <Skeleton variant='circular' className='TaskCardModal-avatar' />
            <Skeleton width={300} />
          </Card>
        </Box>
        <Box className='TaskCardModal-sidebar'>
          <Card className='TaskCardModal-sidebar-card'>
            <Skeleton sx={{ pb: 5 }} />
            <Skeleton sx={{ pb: 5 }} />
            <Skeleton sx={{ pb: 5 }} />
            <Skeleton sx={{ pb: 5 }} />
            <Skeleton sx={{ pb: 5 }} />
            <Skeleton sx={{ pb: 5 }} />
          </Card>
        </Box>
      </Box>
    </Box>
  )
}


const TaskCardModal = (props) => {
  // TODO: User id should be derived from a Cookie
  const { data: currentUser, isCurrentUserLoading, isCurrentUserError } = useCurrentUser()
  const { data: task, isLoading, isError } = useTask(props.taskId, { params: { includeAssociations: 'true' } })

  if (isCurrentUserLoading || isCurrentUserError) return (
    <Skeleton variant='circular' width={40} height={40} />
  )

  return (
    <Box className='TaskCardModal-wrapper'>
      {isLoading || isError ? (
        <TaskCardModalSkeleton />
      ) : (
        <Box className='TaskCardModal-paper'>
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
            <Card className='TaskCardModal-main-description'>
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
              <IconButton className='TaskCardModal-main-newComment-cancel'>
                <FontAwesomeIcon className='TaskCardModal-main-newComment-cancel-icon' icon={faXmark} />
              </IconButton>
            </Card>
            <ModalComment taskId={task.id} />
          </Box>
          <Box className='TaskCardModal-sidebar'>
            <Card className='TaskCardModal-sidebar-card'>
              <Stack spacing={2}>
                <Typography>Author</Typography>
                <Box className='TaskCardModal-sidebar-card-box'>
                  <Avatar className='TaskCardModal-main-avatar'
                    alt={task.author.name} src={task.author.avatarUrl}
                  />
                  <UserInfo userName={task.author.name} userTitle={task.author.role} />
                </Box>
                <Typography>Priority</Typography>
                {task.priority ? <Box className='TaskCardModal-sidebar-card-box-taskPriority'>
                  <PriorityIcon taskPriority={task.priority} />
                </Box> : null
                }
                <Typography>Points</Typography>
                {task.points ? <Avatar>{task.points}</Avatar> : null}
                <Typography>Tags</Typography>
                {task.tags.map((tag) => (
                  <Tag key={tag.id} name={tag.name} colour={tag.colour} />
                ))}
                <Typography>Assigned</Typography>
                <Box className='TaskCardModal-sidebar-card-box'>
                  {task.users.map((user) => (
                    <AvatarPopover
                      key={user.id} userName={user.name} userAvatar={user.avatarUrl} userTitle={task.author.role}
                    />
                  ))}
                </Box>
              </Stack>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  )
}


export default TaskCardModal


TaskCardModal.propTypes = {
  taskId: PropTypes.number.isRequired,
}


