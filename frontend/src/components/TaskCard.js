import * as React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack
} from '@mui/material'
import PropTypes from 'prop-types'


const TaskCard = (props) => {
  return (
    <Box width = '320px'>
      <Card sx = {{ m: 2 }}>
        <CardContent>
          <Typography align='left' color='text.primary'>
            {props.label}
          </Typography>
          <Box sx={{ display: 'flex', mt: 0.2 }}>
            {props.categories.map((category) => (
              <Chip key={category[0]} label={category[0]} sx={{ color: category[1], bgcolor: category[2] }} size='small' />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography color='text.primary' sx = {{ marginRight: 'auto', mt: 1 }}>
              {props.priority}
            </Typography>
            {props.users.map((user) => (
              <Avatar key={user} alt={user} sx = {{ width: 24, height: 24, alignSelf: 'flex-end' }} />
            ))}
          </Box>
        </CardContent>

      </Card>
    </Box>
  )
}

TaskCard.propTypes = {
  label: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired
}

export default TaskCard
