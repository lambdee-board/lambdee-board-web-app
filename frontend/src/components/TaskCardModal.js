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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor lorem sit amet mi molestie consectetur. Curabitur feugiat lacus turpis, in laoreet risus consequat ut. Donec convallis et purus quis gravida. Morbi pretium, eros in dapibus malesuada, ligula sem sodales justo, sit amet aliquam tellus lorem et elit. Aenean luctus interdum orci sit amet facilisis. Aenean orci quam, gravida non luctus vitae, suscipit in erat. Nam ornare turpis id leo pretium, in mollis lacus sagittis. Nullam consequat nunc nec mauris dapibus, a vehicula sapien feugiat. Morbi sed orci eu turpis egestas pellentesque eu quis diam. Vivamus pellentesque porttitor mattis. Morbi dictum suscipit nisi, ut facilisis arcu gravida vitae.
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
          <ModalComment userName={user.name} userAvatar={user.avatarUrl} userTitle='Manager' commentContent='aaa' commentDate='aaa' />
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


