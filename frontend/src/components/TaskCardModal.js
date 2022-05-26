import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  Typography,
  Box,
  Container,
  Card,
  InputBase,
  IconButton,
  Skeleton,
  Avatar,
  Stack,
  Chip
} from '@mui/material'
import './TaskCardModal.sass'
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalComment from './task-card-modal/ModalComment'
import UserInfo from './task-card-modal/UserInfo'
import AvatarPopover from './task-card-modal/AvatarPopover'
import useTask from '../api/useTask'
import PriorityIcon from './PriorityIcon'

const TaskCardModal = (props) => {
  // // TODO: User id should be derived from a Cookie
  // const { data: user, isLoading, isError } = useCurrentUser()
  const { data: task, isLoading, isError } = useTask(props.taskId, { params: { includeAssociations: 'true' } })
  return (
    <Box className='TaskCardModal-wrapper'>
      {isLoading || isError ? (<Box></Box>) : (
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
              <Typography>{task.description}</Typography>
            </Card>
            <Typography>
              Comments
            </Typography>
            <Card className='TaskCardModal-main-newComment'>
              <Avatar className='TaskCardModal-avatar'
                // alt={task.name} src={user.avatarUrl}
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
            {/* <ModalComment taskId={task.id} /> */}
          </Box>
          <Box className='TaskCardModal-sidebar'>
            <Card className='TaskCardModal-sidebar-card'>
              <Stack spacing={2}>
                <Typography>Author</Typography>
                <Box className='TaskCardModal-sidebar-card-box'>
                  <Avatar className='TaskCardModal-main-avatar'
                    alt={task.author.name} src={task.author.avatarUrl}
                  />
                  <UserInfo userName={task.author.name} userTitle={'placeholder'} />
                </Box>
                <Typography>Priority</Typography>
                <Box className='TaskCardModal-sidebar-card-box-taskPriority'>
                  <PriorityIcon taskPriority={task.priority} />
                </Box>
                <Typography>Points</Typography>
                {task.points ? <Avatar>{task.points}</Avatar> : null}
                <Typography>Tags</Typography>
                {task.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.name} sx={{ bgcolor: tag.colour }} size='small' />
                ))}
                <Typography>Assigned</Typography>
                <Box className='TaskCardModal-sidebar-card-box'>
                  {task.users.map((user) => (
                    <AvatarPopover
                      key={user.id} userName={user.name} userAvatar={user.avatarUrl} userTitle='placeholder'
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


