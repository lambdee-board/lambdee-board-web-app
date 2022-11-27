import React from 'react'

import { ListItem } from '@mui/material'

import TaskCard from './TaskCard'

const TaskCardListItem = React.forwardRef((props, ref) => {
  return (
    <ListItem className='TaskList-item' >
      <TaskCard
        ref={ref}
        {...props}
      />
    </ListItem>
  )
})

TaskCardListItem.displayName = 'TaskCardListItem'

export default TaskCardListItem
