import * as React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import {
  Typography,

} from '@mui/material'

function TaskDueTime({ dueTime, format }) {
  const now = dayjs()
  if (dayjs(dueTime).diff(now, 'day') < 0) return <Typography variant='caption' color='red'>{dayjs(dueTime).format(format)}</Typography>
  if (dayjs(dueTime).diff(now, 'day') < 3) return <Typography variant='caption' color='orange'>{dayjs(dueTime).format(format)}</Typography>
  if (dayjs(dueTime).diff(now, 'day') < 7) return <Typography variant='caption' color='green'>{dayjs(dueTime).format(format)}</Typography>
  return <Typography variant='caption' color='blue'>{dayjs(dueTime).format(format)}</Typography>
}

TaskDueTime.propTypes = {
  dueTime: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired
}

export default TaskDueTime
