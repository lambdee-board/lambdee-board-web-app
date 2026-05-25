import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  Typography,
  Avatar,
  AvatarGroup,
  Modal
} from '@mui/material'
import type { UserShort, TagShort, TaskPriority } from '../../types'
import PriorityIcon from '../priority-icon/PriorityIcon'

import TaskCardModal from '../task-card-modal/TaskCardModal'
import AvatarPopover from '../AvatarPopover'
import Tag from '../Tag'
import { mutateList } from '../../api/list'
import TaskDueTime from '../TaskDueTime'

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

const TaskCard = ({ label = '', tags = [], assignedUsers = [], listId, id, dueTime, priority, points }: Props) => {
  const dndRef = useRef(null)
  const { boardId, workspaceId } = useParams()
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => {
    mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
    setOpenTaskCardModal(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Modal
        open={openTaskCardModal}
        onClose={handleCloseTaskCardModal}
      >
        <Box
          className='TaskList-Modal'
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <TaskCardModal taskId={id} boardId={boardId} workspaceId={workspaceId} closeModal={handleCloseTaskCardModal} />
        </Box>
      </Modal>
      <Card ref={dndRef} onClick={handleOpenTaskCardModal} sx={{ p: 1, my: 0.25, mx: 0.5, transition: '.1s ease-in', cursor: 'pointer', '&:hover': { backgroundColor: '#f7f7f7' } }}>
        <Typography>
          {label}
        </Typography>
        {dueTime && <TaskDueTime dueTime={dueTime} format={'MM/DD/YY HH:mm'} />}
        <Box sx={{ mt: 0.25, display: 'flex', flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Tag key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 0.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 'auto' }}>
            <PriorityIcon size='xl' taskPriority={priority} />
            {points ? <Avatar sx={{ width: '24px', height: '24px', ml: 1, fontSize: '16px' }}>{points}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: '25.6px', height: '25.6px', fontSize: '16px' } }}>
            {assignedUsers.map((assignedUser) => (
              <AvatarPopover
                key={assignedUser.id}
                userName={assignedUser.name}
                userAvatar={assignedUser.avatarUrl}
                userTitle={assignedUser.role} />
            ))}
          </AvatarGroup>
        </Box>
      </Card>
    </Box>
  )
}

export default TaskCard
