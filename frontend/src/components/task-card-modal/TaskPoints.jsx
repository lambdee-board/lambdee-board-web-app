import * as React from 'react'
import PropTypes from 'prop-types'

import {
  IconButton,
  InputBase,
  Avatar
} from '@mui/material'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import  { isRegular } from '../../internal/permissions'
import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'

import UserInfo from './UserInfo'

import './TaskPoints.sass'

function TaskPoints({ task, mutate }) {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editPointsVisible, setEditPointsVisible] = React.useState(false)

  const toggleEditPointsButton = () => setEditPointsVisible(!editPointsVisible)
  const editPointsRef = React.useRef()

  const editPointsOnClick = () => {
    toggleEditPointsButton()
    setTimeout(() => {
      if (!editPointsRef.current) return

      const nameInput = editPointsRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editPoints = () => {
    const newPoints = editPointsRef.current.children[0]
    const updatedTask = { points: parseInt(newPoints.value) || 0 }

    apiClient.put(`/api/tasks/${task.id}`, updatedTask)
      .then((response) => {
        // successful request
        mutate({ ...task, points: response.data.points }, { revalidate: false })
        toggleEditPointsButton()
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editPointsIfGiven = () => {
    const newPoints = editPointsRef.current.children[0]
    if (newPoints.value === '') return toggleEditPointsButton()

    editPoints()
  }

  const editPointsInputOnKey = (e) => {
    const excluded = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete']
    if (excluded.includes(e.key)) return

    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editPoints()
      break
    case 'Escape':
      e.preventDefault()
      toggleEditPointsButton()
      break
    default:
      e.preventDefault()
      break
    }
  }

  if (editPointsVisible) return (
    <div className='TaskPoints'>
      <div className='TaskPoints-add-button'>
        <Avatar className='TaskPoints-avatar' alt='Add points'>
          <InputBase
            ref={editPointsRef}
            className='TaskPoints-input-text'
            onKeyDown={(e) => editPointsInputOnKey(e)}
            onBlur={(e) => editPointsIfGiven()}
            type='text'
            inputProps={{ inputMode: 'numeric', pattern: '\\d*', maxLength: 2 }}
          />
        </Avatar>
      </div>
    </div>
  )

  return (
    <div className='TaskPoints'>
      {task.points ? (
        <IconButton sx={{ p: 0, m: 0 }} onClick={isRegular() ? editPointsOnClick : undefined} className='TaskPoints-add-button'>
          <Avatar className='TaskPoints-avatar'>{task.points}</Avatar>
        </IconButton>
      ) : (
        <div onClick={editPointsOnClick} className='TaskPoints-add-button'>
          <Avatar className='TaskPoints-avatar' alt='Add points'>
            <FontAwesomeIcon icon={faPlus} />
          </Avatar>
          <UserInfo userName='Add' />
        </div>
      )}
    </div>
  )
}

TaskPoints.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskPoints
