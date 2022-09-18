import React from 'react'
import PropTypes from 'prop-types'
import { List, Paper, Typography } from '@mui/material'

import './TaskList.sass'
import useListTasks from '../../api/useListTasks'
import TaskListItem from './TaskListItem'

export default function TaskList({ list }) {
  const { data: tasks, mutate: mutateTasks, isLoading, isError } = useListTasks({
    id: list.id,
    axiosOptions: {
      params: {
        includeAssociations: 'true'
      }
    }
  })

  if (isLoading || isError) return (<>Loading</>)

  return (
    <Paper className='TaskList' elevation={1}>
      <div className='TaskList-header'>
        <Typography variant='h6'>
          {list.name}
        </Typography>
      </div>
      <List>
        {tasks?.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </List>
    </Paper>
  )
}

TaskList.propTypes = {
  list: PropTypes.object,
}
