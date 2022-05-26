import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  Avatar
} from '@mui/material'
import PropTypes from 'prop-types'
import './ModalComment.sass'
import UserInfo from './UserInfo'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useComments from '../../api/useComments'

const ModalComment = (props) => {
  const { data: comments, isLoading, isError } = useComments(props.taskId, { params: { withAuthor: 'true' } })
  return (
    <Box>
      {isLoading || isError ? (null) : (
        <Box>
          {comments.map((comment) => (
            <Card key={comment.id} className='ModalComment'>
              <Box>
                <Box className='ModalComment-info'>
                  <Avatar className='ModalComment-info-avatar' alt={comment.author.name} src={comment.author.avatarUrl} />
                  <UserInfo userName={comment.author.name} userTitle={comment.author.role} />
                  <Typography variant='caption' className='ModalComment-info-date'>{comment.updatedAt}</Typography>
                </Box>
                <Divider />
                <Box className='ModalComment-content'>
                  <Typography>
                    {comment.body}
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
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

ModalComment.propTypes = {
  taskId: PropTypes.number.isRequired,
}


export default ModalComment
