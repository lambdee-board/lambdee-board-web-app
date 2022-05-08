import * as React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Avatar,
  Chip
} from '@mui/material'
import PropTypes from 'prop-types'


const TaskCard = (props) => {
  return (
    <Box width = '400px'>
      <Card sx = {{ m: 2 }}>
        <CardContent>
          <Typography align='left' color='text.primary'>
            {props.label}
          </Typography>
          {props.categories.map((category) => (
            <Typography key={category}>
              {category[1]}
            </Typography>
          ))}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Typography align='left' color='text.primary'>
              {props.priority}
            </Typography>
            <Avatar alt='Remy Sharp' />
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
