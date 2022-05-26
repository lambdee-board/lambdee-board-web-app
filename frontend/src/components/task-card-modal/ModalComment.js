import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Divider,
  Button
} from '@mui/material'
import PropTypes from 'prop-types'
import './ModalComment.sass'
import AvatarPopover from './AvatarPopover'
import UserInfo from './UserInfo'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ModalComment = (props) => {
  const { data: comments, isLoading, isError } = useComments(props.taskId)
  return (
    <Card className='ModalComment'>
      <Box className='ModalComment-info'>
        <AvatarPopover userName={props.userName} userAvatar={props.userAvatar} userTitle={props.userTitle} />
        <UserInfo userName={props.userName} userTitle={props.userTitle} />
        <Typography variant='caption' className='ModalComment-info-date'>{props.commentDate}</Typography>
      </Box>
      <Divider />
      <Box className='ModalComment-content'>
        <Typography>
          {props.commentContent}
        </Typography>
      </Box>
      <Box className='ModalComment-footer'>
        <Button className='ModalComment-footer-edit'>
          <Typography variant='body2'>
            <FontAwesomeIcon className='ModalComment-footer-icon' icon={faPencil} />
            Edit</Typography>
        </Button>
        <Button className='ModalComment-footer-delete'>
          <Typography variant='body2'>
            <FontAwesomeIcon className='ModalComment-footer-icon' icon={faTrash} />
            Delete</Typography>
        </Button>
      </Box>
    </Card>
  )
}

ModalComment.propTypes = {
  taskId: PropTypes.number.isRequired,
}


export default ModalComment
