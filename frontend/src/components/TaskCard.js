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
import PriorityIcon from './PriorityIcon'
import './TaskCard.sass'


const TaskCard = (props) => {
  return (
    <div className='TaskCard'>
      <Card className='.MuiCard-root'>
        <Typography>
          {props.label}
        </Typography>
        <Box className='Box-categories'>
          {props.categories.map((category) => (
            <Chip key={category[0]} label={category[0]} sx={{ color: category[1], bgcolor: category[2] }} size='small' />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon priority={props.priority} />
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            {props.users.map((user) => (
              <Avatar key={user} alt={user} />
            ))}
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}

TaskCard.defaultProps = {
  label: '',
  priority: '',
  categories: [],
  users: [],
}

TaskCard.propTypes = {
  label: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
}

export default TaskCard
