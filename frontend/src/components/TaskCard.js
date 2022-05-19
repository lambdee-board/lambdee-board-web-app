import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  AvatarGroup,
  Skeleton
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon.js'
import './TaskCard.sass'

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
  return (
    <div className='TaskCard'>
      <Card className='.MuiCard-root'>
        <Typography>
          {props.taskLabel}
        </Typography>
        <Box className='Box-categories'>
          {props.taskTags.map((taskTag) => (
            <Chip key={taskTag.name} label={taskTag.name} sx={{ color: taskTag.textColor, bgcolor: taskTag.backgroundColor }} size='small' />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon taskPriority={props.taskPriority} />
            {props.taskPoints ? <Avatar className='Box-priority-avatar'>{props.taskPoints}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            {props.assignedUsers.map((assignedUser) => (
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
  taskLabel: PropTypes.string.isRequired,
  taskPriority: PropTypes.string,
  taskTags: PropTypes.array.isRequired,
  assignedUsers: PropTypes.array.isRequired,
  taskPoints: PropTypes.number
}

export default TaskCard
export { TaskCard, TaskCardSkeleton }
