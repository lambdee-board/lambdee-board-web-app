import React, { useRef } from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  AvatarGroup,
  Skeleton,
  Modal
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon'

import './TaskCard.sass'
import TaskCardModal from './TaskCardModal'
import AvatarPopover from './AvatarPopover'
import Tag from './Tag'
import { mutateList } from '../api/useList'


const TaskCardSkeleton = () => {
  return (
    <div className='TaskCard-wrapper'>
      <Card className='TaskCard'>
        <Typography>
          <Skeleton height={36} width={200} variant='text' />
        </Typography>
        <Box className='Box-categories'>
          <Skeleton height={24} width={65} variant='rectangular' />
        </Box>
        <Box className='Box'>
          <Box className='Box-priority' />
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            <Skeleton height={24} width={24} variant='circular' />
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}


const TaskCard = (props) => {
  const dndRef = useRef(null)

  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => {
    mutateList({ id: props.listId, axiosOptions: { params: { tasks: 'visible' } } })
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
          <TaskCardModal taskId={props.id} listId={props.listId} closeModal={handleCloseTaskCardModal} />
        </Box>
      </Modal>
      <Card className='TaskCard' ref={dndRef} onClick={handleOpenTaskCardModal}>
        <Typography className='TaskCard-label'>
          {props.label}
        </Typography>
        <Box className='Box-tags'>
          {props.tags.map((tag) => (
            <Tag key={tag.id} name={tag.name} colour={tag.colour} />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon size='xl' taskPriority={props.priority} />
            {props.points ? <Avatar className='Box-priority-avatar'>{props.points}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            {props.assignedUsers.map((assignedUser) => (
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

TaskCard.defaultProps = {
  label: '',
  tags: [],
  assignedUsers: [],
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
}

export default TaskCard
export { TaskCard, TaskCardSkeleton }
