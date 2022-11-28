import React from 'react'
import PropTypes from 'prop-types'

import { ListItem } from '@mui/material'

import TaskCard from './TaskCard'

const TaskCardListItem = React.forwardRef((props, ref) => {
  return (
    <ListItem
      className='TaskList-item'
      ref={ref}
      style={props.style}
      {...(props.dndListeners ?? {})}
      {...(props.dndAttributes ?? {})}
    >
      <TaskCard
        {...props}
      />
    </ListItem>
  )
})

TaskCardListItem.displayName = 'TaskCardListItem'
TaskCardListItem.propTypes = {
  style: PropTypes.object,
  dndAttributes: PropTypes.object,
  dndListeners: PropTypes.object
}

export default TaskCardListItem
