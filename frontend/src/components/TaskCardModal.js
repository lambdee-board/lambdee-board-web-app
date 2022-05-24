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
  Stack
} from '@mui/material'
import './TaskCardModal.sass'
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useCurrentUser from '../api/useCurrentUser'
import ModalComment from './task-card-modal/ModalComment'
import UserInfo from './task-card-modal/UserInfo'
import AvatarPopover from './task-card-modal/AvatarPopover'

const example = ['Manager', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor lorem sit amet mi molestie consectetur. Curabitur feugiat lacus turpis.', '12/06/2017' ]

const TaskCardModal = (props) => {
// TODO: User id should be derived from a Cookie
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading || isError) return (
    <Skeleton variant='circular' width={40} height={40} />
  )
  return (
    <Box className='TaskCardModal-wrapper'>
      <Box className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Box className='TaskCardModal-main-label'>
            <Typography variant='h6'>
              Fix login issue
              <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
            </Typography>
          </Box>
          <Typography>
              Description
            <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
          </Typography>
          <Card className='TaskCardModal-main-description'>
            <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor lorem sit amet mi molestie consectetur. Curabitur feugiat lacus turpis.</Typography>
          </Card>
          <Typography>
              Comments
          </Typography>
          <Card className='TaskCardModal-main-newComment'>
            <Avatar className='TaskCardModal-main-avatar'
              alt={user.name} src={user.avatarUrl}
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
          <ModalComment userName={user.name} userAvatar={user.avatarUrl} userTitle={example[0]} commentContent={example[1]} commentDate={example[2]} />
        </Box>
        <Box className='TaskCardModal-sidebar'>
          <Card className='TaskCardModal-sidebar-card'>
            <Stack spacing={2}>
              <Typography>Author</Typography>
              <Box className='TaskCardModal-sidebar-card-box'>
                <Avatar className='TaskCardModal-main-avatar'
                  alt={user.name} src={user.avatarUrl}
                />
                <UserInfo className='TaskCardModal-sidebar-card-box-userInfo' userName={user.name} userTitle={example[0]} />
              </Box>
              <Typography>Points</Typography>
              <Typography>Tags</Typography>
              <Typography>Assigned</Typography>
              <Box className='TaskCardModal-sidebar-card-box'>
                <AvatarPopover
                  userName={user.name} userAvatar={user.avatarUrl} userTitle={example[0]}
                />
                <AvatarPopover
                  userName={user.name} userAvatar={user.avatarUrl} userTitle={example[0]}
                />
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}


export default TaskCardModal


TaskCardModal.propTypes = {
  taskId: PropTypes.number.isRequired,
}


