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
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import './TaskComments.sass'
import './Markdown.sass'

import UserInfo from './UserInfo'
import useComments from '../../api/useComments'

const TaskComments = (props) => {
  const { data: comments, isLoading, isError } = useComments(props.taskId, { params: { withAuthor: 'true' } })
  return (
    <Box className='TaskComments-wrapper'>
      {isLoading || isError ? (null) : (
        <Box className='TaskComments-loaded-wrapper'>
          {comments.map((comment) => (
            <Card key={comment.id} className='TaskComment'>
              <Box>
                <Box className='TaskComment-info'>
                  <Avatar className='TaskComment-info-avatar' alt={comment.author.name} src={comment.author.avatarUrl} />
                  <UserInfo userName={comment.author.name} userTitle={comment.author.role} />
                  <Typography variant='caption' className='TaskComment-info-date'>{comment.updatedAt.split('T')[0]}</Typography>
                </Box>
                <Divider />
                <Box className='TaskComment-content markdown-text'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {comment.body}
                  </ReactMarkdown>
                </Box>
                <Box className='TaskComment-footer'>
                  <Button className='TaskComment-footer-edit'>
                    <Typography variant='body2'>
                      <FontAwesomeIcon className='TaskComment-footer-icon' icon={faPencil} />
                  Edit</Typography>
                  </Button>
                  <Button className='TaskComment-footer-delete'>
                    <Typography variant='body2'>
                      <FontAwesomeIcon className='TaskComment-footer-icon' icon={faTrash} />
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

TaskComments.propTypes = {
  taskId: PropTypes.number.isRequired,
}


export default TaskComments
