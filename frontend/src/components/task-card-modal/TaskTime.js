import * as React from 'react'
import PropTypes from 'prop-types'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, TextField, Typography } from '@mui/material'

import apiClient from '../../api/apiClient'
import { useDispatch } from 'react-redux'
import { addAlert } from '../../redux/slices/appAlertSlice'

import './TaskTime.sass'
import { isRegular } from '../../permissions/RegularContent'


function TaskTime({ task, mutate }) {
  const [openTimeDial, setTimeDial] = React.useState(false)
  const [wrongFormat, setWrongFormat] = React.useState(false)
  const [userTime, setUserTime] = React.useState('')
  const dispatch = useDispatch()

  const addTimeToTask = () => {
    if (!userTime) return

    const timeToAdd = getTimeInSeconds(userTime)
    console.log('1', timeToAdd)
    if (timeToAdd === null || timeToAdd === 0) {
      console.log('3', timeToAdd)
      return
    }

    const payload = { time: timeToAdd }
    console.log(payload)
    apiClient.put(`/api/tasks/${task.id}/add_time`, payload)
      .then((response) => {
        // successful request
        mutate({ ...task, spentTime: task.spentTime + timeToAdd })
        handleDialClose()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const handleDialSubmit = (e) => {
    if (addTimeToTask()) handleDialClose(e)
    else e.preventDefault()
  }

  const handleDialClose = (e) => {
    setUserTime('')
    setTimeDial(false)
    setWrongFormat(false)
  }

  const getTimeInSeconds = () => {
    const userTimeSplit = userTime.split(' ')
    let userTimeSeconds = 0
    setWrongFormat(false)

    for (const item of userTimeSplit) {
      if (!item) continue

      switch (true) {
      case /^\d+d$/.test(item):
        userTimeSeconds += parseInt(item) * 24 * 3600
        break

      case /^\d+h$/.test(item):
        userTimeSeconds += parseInt(item) * 3600
        break

      case /^\d+m$/.test(item):
        userTimeSeconds += parseInt(item) * 60
        break

      default:
        setWrongFormat(true)
        return null
      }
    }
    return userTimeSeconds
  }
  const getFormattedTime = () => {
    const d = Math.floor(task.spentTime / (3600 * 24))
    const h = Math.floor(task.spentTime % (3600 * 24) / 3600)
    const m = Math.floor(task.spentTime % 3600 / 60)

    const dDisplay = d > 0 ? `${d}d ` : ''
    const hDisplay = h > 0 ? `${h}h ` : ''
    const mDisplay = m > 0 ? `${m}m` : ''
    return dDisplay + hDisplay + mDisplay
  }

  return (
    <div className='TaskTime'>
      <div className='TaskTime-progress' onClick={isRegular() ? () => setTimeDial(true) : undefined}>
        <div>
          <LinearProgress variant='determinate' value={task.spentTime > 604800 ? 100 : task.spentTime / 6048} />
        </div>
        <div>
          <Typography variant='body2' color='text.secondary'>
            {task.spentTime === 0 ? 'No time registered' : getFormattedTime(task.spentTime)}
          </Typography>
        </div>
      </div>

      <Dialog
        className='TaskTime-dialog'
        open={openTimeDial}
        onClose={handleDialClose}
      >
        <form onSubmit={handleDialSubmit}>
          <DialogTitle>
            Time spent on: <Typography color='primary'>{task.name}</Typography>
          </DialogTitle>
          <DialogContent className='TaskTime-dialog-content'>
            <DialogContentText>Providing time use following format:</DialogContentText>
            <DialogContentText component='ul' sx={{ paddingLeft: '20px' }}>
              <li>d - time in days</li>
              <li>h - time in hours</li>
              <li>m - time in minutes</li>
            </DialogContentText>
            <TextField
              fullWidth
              autoFocus
              margin='normal'
              id='formatted-task-time'
              value={userTime}
              onChange={(e) => setUserTime(e.target.value)}
              label='Formatted time'
              type='text'
              variant='standard'
              error={wrongFormat}
            />
            <DialogContentText>ex. 3d 14h 43m</DialogContentText>
            <DialogContentText sx={{ fontSize: '0.6rem' }}>Make sure that digits and letters are connected</DialogContentText>
          </DialogContent>
          <DialogActions className='create-tag-buttons'>
            <Button onClick={handleDialClose}>Cancel</Button>
            <Button type='submit'>Add time</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

TaskTime.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskTime
