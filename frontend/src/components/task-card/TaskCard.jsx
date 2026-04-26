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
import PropTypes from 'prop-types'
import PriorityIcon from '../priority-icon/PriorityIcon'

import './TaskCard.sass'
import TaskCardModal from '../task-card-modal/TaskCardModal'
import AvatarPopover from '../AvatarPopover'
import Tag from '../Tag'
import { mutateList } from '../../api/list'
import TaskDueTime from '../TaskDueTime'

const TaskCard = ({ label = '', tags = [], assignedUsers = [], listId, id, dueTime, priority, points }) => {
  const dndRef = useRef(null)
  const { boardId, workspaceId } = useParams()
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => {
    mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
    setOpenTaskCardModal(false)
  }

  return (
    <div className='TaskCard-wrapper' >
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
      <Card className='TaskCard' ref={dndRef} onClick={handleOpenTaskCardModal}>
        <Typography className='TaskCard-label'>
          {label}
        </Typography>
        {dueTime && <TaskDueTime dueTime={dueTime} format={'MM/DD/YY HH:mm'} />}
        <Box className='Box-tags'>
          {tags.map((tag) => (
            <Tag key={tag.id} name={tag.name} colour={tag.colour} />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon size='xl' taskPriority={priority} />
            {points ? <Avatar className='Box-priority-avatar'>{points}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
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
    </div>
  )
}

TaskCard.propTypes = {
  assignedUsers: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  points: PropTypes.number,
  priority: PropTypes.string,
  tags: PropTypes.array.isRequired,
  listId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  dueTime: PropTypes.string,
}

export default TaskCard
