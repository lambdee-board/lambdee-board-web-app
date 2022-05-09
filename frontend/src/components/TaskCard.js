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
import './TaskCard.css'


const TaskCard = (props) => {
  return (
    <Box width = '300px'>
      <Card sx = {{ m: 2 }}>
        <div className='Card-content'>
          <Typography align='left' color='text.primary'>
            {props.label}
          </Typography>
          <Box sx={{ display: 'flex', mt: 0.2 }}>
            {props.categories.map((category) => (
              <Chip key={category[0]} label={category[0]} sx={{ color: category[1], bgcolor: category[2] }} size='small' />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', mt: 0.2 }}>
            <Typography color='text.primary' sx = {{ marginRight: 'auto', mt: 1 }}>
              <PriorityIcon priority={props.priority} />
            </Typography>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 14 } }}>
              {props.users.map((user) => (
                <Avatar key={user} alt={user} sx = {{ alignSelf: 'flex-end' }} />
              ))}
            </AvatarGroup>
          </Box>
        </div>
      </Card>
    </Box>
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
