import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Typography,
  InputBase,
  Card,
  Avatar
} from '@mui/material'
import { faPencil, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './TaskPoints.sass'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import PriorityIcon from '../PriorityIcon'
import UserInfo from './UserInfo'


function TaskPoints({ task, mutate }) {
  const dispatch = useDispatch()
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
    const updatedPoints = {
      points: newPoints.value,

    }
    apiClient.put(`/api/tasks/${task.id}`, updatedPoints)
      .then((response) => {
        // successful request
        mutate({ ...task, names: [...task?.name || [], response.data] })
        toggleEditPointsButton()
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const editPointsInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editPoints()
      break
    case 'Escape':
      e.preventDefault()
      toggleEditPointsButton()
      break
    }
  }
  return (
    <Box className='TaskPoints'>
      {task.points ? (<Box>
        {!editPointsVisible ? (
          <IconButton sx={{ p: 0, m: 0 }} onClick={editPointsOnClick} className='TaskPoints-add-button'>
            <Avatar className='TaskPoints-avatar'>{task.points}</Avatar>
          </IconButton>
        ) : (
          <Box className='TaskPoints-add-button'>
            <Avatar className='TaskPoints-avatar' alt='Add points'>
              <InputBase
                ref={editPointsRef}
                className='TaskPoints-input-text'
                onKeyDown={(e) => editPointsInputOnKey(e)}
                onBlur={(e) => toggleEditPointsButton()}
                inputProps={{ maxLength: 2 }}
              />
            </Avatar>
          </Box>
        )

        }
      </Box>) : (
        <Box >
          {!editPointsVisible ? (
            <Box onClick={editPointsOnClick} className='TaskPoints-add-button'>
              <Avatar className='TaskPoints-avatar' alt='Add points'>
                <FontAwesomeIcon icon={faPlus} />
              </Avatar>
              <UserInfo userName='Add' />
            </Box>
          ) : (
            <Box className='TaskPoints-add-button'>
              <Avatar className='TaskPoints-avatar' alt='Add points'>
                <InputBase
                  ref={editPointsRef}
                  className='TaskPoints-input-text'
                  onKeyDown={(e) => editPointsInputOnKey(e)}
                  onBlur={(e) => toggleEditPointsButton()}
                  inputProps={{ maxLength: 2 }}
                />
              </Avatar>
            </Box>)
          }

        </Box>
      )}
    </Box>
  )
}

TaskPoints.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskPoints
