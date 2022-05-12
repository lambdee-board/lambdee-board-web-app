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
          {props.taskCategories.map((taskCategory) => (
            <Chip key={taskCategory[0]} label={taskCategory[0]} sx={{ color: taskCategory[1], bgcolor: taskCategory[2] }} size='small' />
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
  taskPriority: '',
  taskCategories: [],
  assignedUsers: [],
  taskPoints: null,
}

TaskCard.propTypes = {
  taskLabel: PropTypes.string.isRequired,
  taskPriority: PropTypes.string.isRequired,
  taskCategories: PropTypes.array.isRequired,
  assignedUsers: PropTypes.array.isRequired,
  taskPoints: PropTypes.number
}

export default TaskCard
