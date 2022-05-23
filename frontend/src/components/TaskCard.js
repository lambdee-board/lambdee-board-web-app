import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  AvatarGroup,
  Skeleton,
  Modal
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon.js'
import './TaskCard.sass'
import TaskCardModal from './TaskCardModal'


const TaskCardSkeleton = () => {
  return (
    <div className='TaskCard'>
      <Card className='.MuiCard-root'>
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
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => setOpenTaskCardModal(false)
  return (
    <div className='TaskCard'>
      <Modal
        open={openTaskCardModal}
        onClose={handleCloseTaskCardModal}
      >
        <Box className='TaskList-Modal' sx={{  position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 0 }}>
          <TaskCardModal taskId={props.taskId} />
        </Box>
      </Modal>
      <Card onClick={handleOpenTaskCardModal} className='.MuiCard-root'>
        <Typography>
          {props.taskLabel}
        </Typography>
        <Box className='Box-categories'>
          {props.taskTags.map((taskTag, index) => (
            <Chip key={taskTag.name + index} label={taskTag.name} sx={{ color: taskTag.textColor, bgcolor: taskTag.backgroundColor }} size='small' />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon taskPriority={props.taskPriority} />
            {props.taskPoints ? <Avatar className='Box-priority-avatar'>{props.taskPoints}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            {props.assignedUsers.map((assignedUser, index) => (
              <Avatar key={assignedUser.id} alt={assignedUser.name} src={assignedUser.avatarUrl} />
            ))}
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}

TaskCard.defaultProps = {
  taskLabel: '',
  taskTags: [],
  assignedUsers: [],
}

TaskCard.propTypes = {
  taskId: PropTypes.number.isRequired,
  taskLabel: PropTypes.string.isRequired,
  taskPriority: PropTypes.string,
  taskTags: PropTypes.array.isRequired,
  assignedUsers: PropTypes.array.isRequired,
  taskPoints: PropTypes.number
}

export default TaskCard
export { TaskCard, TaskCardSkeleton }
