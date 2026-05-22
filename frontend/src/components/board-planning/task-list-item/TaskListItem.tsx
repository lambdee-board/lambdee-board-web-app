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
    <div style={{ width: '100%' }}>
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
      <Box ref={dndRef} onClick={handleOpenTaskCardModal} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', p: 0.5, transition: '.1s ease-in', cursor: 'pointer' }}>
        <Typography variant='caption' sx={{ fontSize: '14px' }} >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end', width: '192px', mr: 2 }}>
            <AvatarGroup max={(3)} >
              {tags.map((tag) => (
                <Tag name={tag.name} color={tag.color} key={tag.id} />
              ))}
            </AvatarGroup>
          </Box>
          <Box sx={{ width: '96px', mr: 1 }}>
            {dueTime && <TaskDueTime dueTime={dueTime} format={'MM/DD/YY HH:mm'} />}
          </Box>
          <Box sx={{ width: '32px', mr: 1 }}>
            <PriorityIcon size='xl' taskPriority={priority} />
          </Box>
          <Box sx={{ width: '32px', mr: 1 }}>
            {points ? <Avatar sx={{ width: '24px', height: '24px', fontSize: '16px' }}>{points}</Avatar> : null}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, width: '64px', mr: 1 }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: '25.6px', height: '25.6px', fontSize: '16px' } }}>
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
      </Box>
    </div>
  )
}

export default TaskListItem
