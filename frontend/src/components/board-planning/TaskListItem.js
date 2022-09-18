import React from 'react'
import PropTypes from 'prop-types'
import { Divider, ListItem, Typography } from '@mui/material'

import './TaskListItem.sass'

export default function TaskListItem({ task }) {
  return (
    <>
      <ListItem className='TaskListItem'>
        <Typography>
          {task.name}
        </Typography>
      </ListItem>
      <Divider />
    </>
  )
}

TaskListItem.propTypes = {
  task: PropTypes.object,
}
