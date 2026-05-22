import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Modal
} from '@mui/material'
import type { UserShort, TagShort, TaskPriority } from '../../../types'

import { mutateList } from '../../../api/list'

import PriorityIcon from '../../priority-icon/PriorityIcon'
import TaskCardModal from '../../task-card-modal/TaskCardModal'
import AvatarPopover from '../../AvatarPopover'
import Tag from '../../Tag'
import TaskDueTime from '../../TaskDueTime'

import './TaskListItem.sass'

interface Props {
  label?: string
  tags?: TagShort[]
  assignedUsers?: UserShort[]
  listId: number
  id: number
  dueTime?: string
  priority?: TaskPriority
  points?: number
  pos: number
  index: number
}

const TaskListItem = ({ label = '', tags = [], assignedUsers = [], listId, id, dueTime, priority, points }: Props) => {
  const dndRef = useRef(null)
  const { boardId, workspaceId } = useParams()
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => {
    mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
    setOpenTaskCardModal(false)
  }
  return (
    <div className='TaskListItem-wrapper' >
      <Modal
        open={openTaskCardModal}
        onClose={handleCloseTaskCardModal}
      >
        <Box
          className='TaskListItem-Modal'
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <TaskCardModal taskId={id} boardId={boardId} workspaceId={workspaceId} closeModal={handleCloseTaskCardModal} />
        </Box>
      </Modal>
      <div className='TaskListItem' ref={dndRef} onClick={handleOpenTaskCardModal}>
        <Typography variant='caption' sx={{ fontSize: '14px' }} >
          {label}
        </Typography>
        <Box className='TaskListItem-properties'>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} className='TaskListItem-properties-tags'>
            <AvatarGroup max={(3)} >
              {tags.map((tag) => (
                <Tag name={tag.name} color={tag.color} key={tag.id} />
              ))}
            </AvatarGroup>
          </Box>
          <Box className='TaskListItem-properties-duetime'>
            {dueTime && <TaskDueTime dueTime={dueTime} format={'MM/DD/YY HH:mm'} />}
          </Box>
          <Box className='TaskListItem-properties-priority'>
            <PriorityIcon size='xl' taskPriority={priority} />

          </Box>
          <Box className='TaskListItem-properties-points'>
            {points ? <Avatar className='Box-priority-avatar'>{points}</Avatar> : null}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }} className='TaskListItem-properties-avatars'>
            <AvatarGroup max={3} className='.MuiAvatar-root'>
              {assignedUsers.map((assignedUser) => (
                <AvatarPopover
                  key={assignedUser.id}
                  userName={assignedUser.name}
                  userAvatar={assignedUser.avatarUrl}
                  userTitle={assignedUser.role} />
              ))}
            </AvatarGroup>
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default TaskListItem
