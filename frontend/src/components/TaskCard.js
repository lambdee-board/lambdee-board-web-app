import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  AvatarGroup
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon.js'
import './TaskCard.sass'


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
              <Avatar key={assignedUser} alt={assignedUser} />
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
