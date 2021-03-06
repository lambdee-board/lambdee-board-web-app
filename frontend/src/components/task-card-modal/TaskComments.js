import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  Avatar,
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
import useCurrentUser from '../../api/useCurrentUser'

const NewTaskComment = ({ currentUser, taskId, mutateComments, comments }) => {
  const [commentEditorVisible, setCommentEditorVisible] = React.useState(false)
  const [commentDraft, setCommentDraft] = React.useState(null)
  const dispatch = useDispatch()

  const createComment = () => {
    const payload = {
      body: commentDraft,
      authorId: currentUser.id,
      taskId
    }

    apiClient.post('/api/comments', payload)
      .then((response) => {
        // successful request
        const expectedNewComment = {
          ...payload,
          author: { ...currentUser },
          updatedAt: new Date(),
          createdAt: new Date()
        }
        mutateComments([expectedNewComment, ...comments])
        closeCommentEditor()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const closeCommentEditor = () => {
    setCommentDraft(null)
    setCommentEditorVisible(false)
  }

  const openCommentEditor = () => {
    setCommentEditorVisible(true)
    setTimeout(() => {
      document.querySelector('.TaskComment-editor textarea').focus()
    }, 50)
  }

  if (commentEditorVisible) return (
    <Card className='TaskComment'>
      <Box>
        <Box className='TaskComment-info'>
          <Avatar className='TaskComment-info-avatar' alt={currentUser.name} src={currentUser.avatarUrl} />
          <UserInfo userName={currentUser.name} userTitle={currentUser.role} />

          {/* <Typography variant='caption' className='TaskComment-info-date'>
            {date}
          </Typography> */}
        </Box>
        <Divider />
        <div className='TaskComment-editor'>
          <MDEditor
            value={commentDraft || ''}
            onChange={(val) => { setCommentDraft(val) }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]]
            }}
          />
        </div>


        <Box className='TaskComment-footer'>
          <Button
            variant='contained'
            onClick={() => createComment()}
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
        </Box>
      </Box>
    </Card>
  )

  return (
    <Card className='TaskComments-newComment'>
      <Avatar className='TaskCardModal-avatar'
        alt={currentUser.name} src={currentUser.avatarUrl}
      />
      <Typography
        className='TaskComments-newComment-placeholder'
        onClick={() => openCommentEditor()}
      >
        Write a comment...
      </Typography>
    </Card>
  )
}

NewTaskComment.propTypes = {
  taskId: PropTypes.number.isRequired,
  mutateComments: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
}

const TaskComment = ({ currentUser, comment, mutateComments }) => {
  const dispatch = useDispatch()
  const [commentEditorVisible, setCommentEditorVisible] = React.useState(false)
  const [commentDraft, setCommentDraft] = React.useState(null)

  const date = dateFormat(new Date(comment.updatedAt), 'd mmmm yyyy, HH:MM')

  const closeCommentEditor = () => {
    setCommentDraft(null)
    setCommentEditorVisible(false)
  }

  const openCommentEditor = () => {
    setCommentEditorVisible(true)
    setTimeout(() => {
      document.querySelector('.TaskComment-editor textarea').focus()
    }, 50)
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

  const deleteComment = () => {
    apiClient.delete(`/api/comments/${comment.id}`)
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
              value={commentDraft || ''}
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

        {currentUser.id === comment.authorId ? (
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
                  onClick={() => openCommentEditor()}
                >
                  <Typography variant='body2'>
                    <FontAwesomeIcon className='TaskComment-footer-icon' icon={faPencil} />
                    Edit
                  </Typography>
                </Button>
                <Button
                  className='TaskComment-footer-delete'
                  onClick={() => deleteComment()}
                >
                  <Typography variant='body2'>
                    <FontAwesomeIcon className='TaskComment-footer-icon' icon={faTrash} />
                    Delete
                  </Typography>
                </Button>
              </>
            )}
          </Box>
        ) : null}
      </Box>
    </Card>
  )
}

TaskComment.propTypes = {
  comment: PropTypes.object.isRequired,
  mutateComments: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
}

const TaskComments = (props) => {
  const { data: comments, isLoading, isError, mutate: mutateComments } = useComments({ id: props.taskId, axiosOptions: { params: { withAuthor: 'true' } } })
  const { data: currentUser, isLoading: isCurrentUserLoading, isError: isCurrentUserError } = useCurrentUser()

  // TODO: Skeleton
  if (isLoading || isError || isCurrentUserLoading || isCurrentUserError) return (
    <Box className='TaskComments-wrapper'>
    </Box>
  )

  return (
    <>
      <Box className='TaskComments-wrapper'>
        <NewTaskComment
          currentUser={currentUser}
          taskId={props.taskId}
          comments={comments}
          mutateComments={mutateComments}
        />
        <div>
          {comments?.map((comment) => (
            <TaskComment
              key={`${comment.id}_${comment.name}`}
              currentUser={currentUser}
              comment={comment}
              mutateComments={mutateComments}
            />
          ))}
        </div>
      </Box>
    </>
  )
}

TaskComments.propTypes = {
  taskId: PropTypes.number.isRequired,
}


export default TaskComments
