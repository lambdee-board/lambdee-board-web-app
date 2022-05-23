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
  Avatar
} from '@mui/material'
import './TaskCardModal.sass'
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useCurrentUser from '../api/useCurrentUser'
import ModalComment from './task-card-modal/ModalComment'

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
            <Typography variant='h5'>
              Fix login issue
              <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
            </Typography>
          </Box>
          <Typography variant='h6'>
              Description
            <FontAwesomeIcon className='TaskCardModal-main-icon' icon={faPencil} />
          </Typography>
          <Card className='TaskCardModal-main-description'>
            <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor lorem sit amet mi molestie consectetur. Curabitur feugiat lacus turpis.</Typography>
          </Card>
          <Typography variant='h6'>
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
          <ModalComment userName={user.name} userAvatar={user.avatarUrl} userTitle='Manager' commentContent='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor lorem sit amet mi molestie consectetur. Curabitur feugiat lacus turpis.' commentDate='12/06/2017' />
        </Box>
        <Box className='TaskCardModal-side'>
          asdasdas
        </Box>
      </Box>
    </Box>
  )
}


export default TaskCardModal


TaskCardModal.propTypes = {
  taskId: PropTypes.number.isRequired,
}


