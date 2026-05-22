import * as React from 'react'
import rehypeSanitize from 'rehype-sanitize'
import dateFormat from 'dateformat'

import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  Avatar,
  Modal
} from '@mui/material'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MDEditor from '@uiw/react-md-editor'

import apiClient from '../../../api/axios-client'
import useComments from '../../../api/comments'
import useCurrentUser from '../../../api/current-user'
import useAppAlertStore from '../../../stores/app-alert'
import type { User, Comment } from '../../../types'

import UserInfo from '../UserInfo'
import CustomAlert from '../../custom-alert/CustomAlert'


interface NewTaskCommentProps {
  currentUser: User
  taskId: number
  mutateComments: (data?: unknown) => void
  comments: Comment[]
}

const NewTaskComment = ({ currentUser, taskId, mutateComments, comments }: NewTaskCommentProps) => {
  const [commentEditorVisible, setCommentEditorVisible] = React.useState(false)
  const [commentDraft, setCommentDraft] = React.useState<string | null>(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)

  const createComment = () => {
    const payload = {
      body: commentDraft,
      authorId: currentUser.id,
      taskId
    }

    apiClient.post('/api/comments', payload)
      .then((response) => {
        const expectedNewComment = {
          ...payload,
          author: { ...currentUser },
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        mutateComments([expectedNewComment, ...comments])
        closeCommentEditor()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const closeCommentEditor = () => {
    setCommentDraft(null)
    setCommentEditorVisible(false)
  }

  const openCommentEditor = () => {
    setCommentEditorVisible(true)
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('.TaskComment-editor textarea')?.focus()
    }, 50)
  }

  if (commentEditorVisible) return (
    <Card data-color-mode='light'>
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', px: 1 }}>
          <Avatar sx={{ width: '32px', height: '32px' }} alt={currentUser.name} src={currentUser.avatarUrl} />
          <UserInfo userName={currentUser.name} userTitle={currentUser.role} />
        </Box>
        <Divider />
        <div className='TaskComment-editor'>
          <MDEditor
            value={commentDraft || ''}
            onChange={(val) => { setCommentDraft(val ?? null) }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize] as any]
            }}
            style={{ overflow: 'brake-word' }}
          />
        </div>


        <Box sx={{ display: 'flex', flexDirection: 'row', p: 0.5 }}>
          <Button variant='contained' color='primary' onClick={() => createComment()}>Save</Button>
          <Button variant='text' sx={{ color: '#FF0000' }} onClick={() => closeCommentEditor()}>Cancel</Button>
        </Box>
      </Box>
    </Card>
  )

  return (
    <Card sx={{ p: 1, mt: 1, mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', alignContent: 'center', flexWrap: 'wrap' }}>
      <Avatar alt={currentUser.name} src={currentUser.avatarUrl} />
      <Typography sx={{ color: '#696969', ml: 1, cursor: 'pointer' }} onClick={() => openCommentEditor()}>
        Write a comment...
      </Typography>
    </Card>
  )
}

interface TaskCommentProps {
  currentUser: User
  comment: Comment & { author: User }
  mutateComments: () => void
}

const TaskComment = ({ currentUser, comment, mutateComments }: TaskCommentProps) => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [commentEditorVisible, setCommentEditorVisible] = React.useState(false)
  const [commentDraft, setCommentDraft] = React.useState<string | null>(null)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const date = dateFormat(new Date(comment.updatedAt), 'd mmmm yyyy, HH:MM')

  const closeCommentEditor = () => {
    setCommentDraft(null)
    setCommentEditorVisible(false)
  }

  const openCommentEditor = () => {
    setCommentEditorVisible(true)
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('.TaskComment-editor textarea')?.focus()
    }, 50)
  }

  const editComment = () => {
    const payload = { body: commentDraft }

    apiClient.put(`/api/comments/${comment.id}`, payload)
      .then((response) => {
        mutateComments()
        setCommentEditorVisible(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteComment = () => {
    apiClient.delete(`/api/comments/${comment.id}`)
      .then((response) => {
        mutateComments()
        setCommentEditorVisible(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (commentDraft == null && comment?.body != null) setCommentDraft(comment.body)

  return (
    <Card sx={{ mb: 2 }}>
      <Modal
        open={alertModalState}
        onClose={toggleAlertModalState}
      >
        <Box
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <CustomAlert confirmAction={deleteComment}
            dismissAction={toggleAlertModalState}
            title='Delete Comment?'
            message='Are you sure you want to delete this comment?'
            confirmMessage='Confirm, delete comment' />
        </Box>
      </Modal>
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', px: 1 }}>
          <Avatar sx={{ width: '32px', height: '32px' }} alt={comment.author.name} src={comment.author.avatarUrl} />
          <UserInfo userName={comment.author.name} userTitle={comment.author.role} />
          <Typography variant='caption' sx={{ mr: 2, ml: 'auto', alignSelf: 'center', color: '#696969' }}>
            {date}
          </Typography>
        </Box>
        <Divider />

        {commentEditorVisible ? (
          <div className='TaskComment-editor'>
            <MDEditor
              value={commentDraft || ''}
              onChange={(val) => { setCommentDraft(val ?? null) }}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize] as any]
              }}
            />
          </div>
        ) : (
          <Box className='markdown-text' sx={{ py: 1, px: 3 }}>
            <MDEditor.Markdown
              source={comment.body}
              rehypePlugins={[[rehypeSanitize] as any]}
            />
          </Box>
        )}

        {currentUser.id === comment.authorId ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', p: 0.5 }}>
            {commentEditorVisible ? (
              <>
                <Button variant='contained' color='primary' onClick={() => editComment()}>Save</Button>
                <Button variant='text' sx={{ color: '#FF0000' }} onClick={() => closeCommentEditor()}>Cancel</Button>
              </>
            ) : (
              <>
                <Button sx={{ color: '#1082F3' }} onClick={() => openCommentEditor()}>
                  <Typography variant='body2'>
                    <FontAwesomeIcon style={{ paddingRight: 8 }} icon={faPencil} />
                    Edit
                  </Typography>
                </Button>
                <Button sx={{ color: '#FF0000' }} onClick={toggleAlertModalState}>
                  <Typography variant='body2'>
                    <FontAwesomeIcon style={{ paddingRight: 8 }} icon={faTrash} />
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

interface TaskCommentsProps {
  taskId: number
}

const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const { data: comments, isLoading, isError, mutate: mutateComments } = useComments({ id: taskId, axiosOptions: { params: { withAuthor: 'true' } } })
  const { data: currentUser, isLoading: isCurrentUserLoading, isError: isCurrentUserError } = useCurrentUser()

  if (isLoading || isError || isCurrentUserLoading || isCurrentUserError) return (
    <Box />
  )

  return (
    <>
      <Box>
        <NewTaskComment
          currentUser={currentUser}
          taskId={taskId}
          comments={comments}
          mutateComments={mutateComments}
        />
        <div>
          {comments?.map((comment) => (
            <TaskComment
              key={`${comment.id}_${comment.id}`}
              currentUser={currentUser}
              comment={comment as Comment & { author: User }}
              mutateComments={mutateComments}
            />
          ))}
        </div>
      </Box>
    </>
  )
}

export default TaskComments
