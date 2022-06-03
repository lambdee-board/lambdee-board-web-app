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
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import dateFormat from 'dateformat'
import { useDispatch } from 'react-redux'

import './TaskComments.sass'

import { addAlert } from '../../redux/slices/appAlertSlice'
import apiClient from '../../api/apiClient'
import UserInfo from './UserInfo'
import useComments from '../../api/useComments'

const TaskComment = ({ comment, mutateComments }) => {
  const dispatch = useDispatch()
  const [commentEditorVisible, setCommentEditorVisible] = React.useState(false)
  const [commentDraft, setCommentDraft] = React.useState(null)

  const date = dateFormat(new Date(comment.updatedAt), 'd mmmm yyyy, HH:MM')

  const closeCommentEditor = () => {
    setCommentDraft(null)
    setCommentEditorVisible(false)
  }

  const editComment = () => {
    const payload = { body: commentDraft }

    apiClient.put(`/api/comments/${comment.id}`, payload)
      .then((response) => {
        // successful request
        mutateComments()
        setCommentEditorVisible(false)
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  if (commentDraft == null && comment?.body != null) setCommentDraft(comment.body)

  return (
    <Card className='TaskComment'>
      <Box>
        <Box className='TaskComment-info'>
          <Avatar className='TaskComment-info-avatar' alt={comment.author.name} src={comment.author.avatarUrl} />
          <UserInfo userName={comment.author.name} userTitle={comment.author.role} />

          <Typography variant='caption' className='TaskComment-info-date'>
            {date}
          </Typography>
        </Box>
        <Divider />

        {commentEditorVisible ? (
          <div className='TaskComment-editor'>
            <MDEditor
              value={commentDraft}
              onChange={(val) => { setCommentDraft(val) }}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]]
              }}
            />
          </div>
        ) : (
          <Box className='TaskComment-content markdown-text' data-color-mode='light'>
            <MDEditor.Markdown
              source={comment.body}
              rehypePlugins={[[rehypeSanitize]]}
            />
          </Box>
        )}


        <Box className='TaskComment-footer'>
          {commentEditorVisible ? (
            <>
              <Button
                variant='contained'
                onClick={() => editComment()}
              >
                Save
              </Button>
              <Button
                variant='text'
                color='secondary'
                onClick={() => closeCommentEditor()}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                className='TaskComment-footer-edit'
                onClick={() => setCommentEditorVisible(true)}
              >
                <Typography variant='body2'>
                  <FontAwesomeIcon className='TaskComment-footer-icon' icon={faPencil} />
                  Edit
                </Typography>
              </Button>
              <Button className='TaskComment-footer-delete'>
                <Typography variant='body2'>
                  <FontAwesomeIcon className='TaskComment-footer-icon' icon={faTrash} />
                  Delete
                </Typography>
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  )
}

TaskComment.propTypes = {
  comment: PropTypes.object.isRequired,
  mutateComments: PropTypes.func.isRequired
}

const TaskComments = (props) => {
  const { data: comments, isLoading, isError, mutate: mutateComments } = useComments(props.taskId, { params: { withAuthor: 'true' } })

  // TODO: Skeleton
  if (isLoading || isError) return (
    <Box className='TaskComments-wrapper'>
    </Box>
  )

  return (
    <Box className='TaskComments-wrapper'>
      <Box className='TaskComments-loaded-wrapper'>
        {comments?.map((comment) => (
          <TaskComment comment={comment} comments={comments} key={comment.id} mutateComments={mutateComments} />
        ))}
      </Box>
    </Box>
  )
}

TaskComments.propTypes = {
  taskId: PropTypes.number.isRequired,
}


export default TaskComments
