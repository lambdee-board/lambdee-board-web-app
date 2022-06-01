import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Avatar,
  Autocomplete,
  TextField
} from '@mui/material'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './TaskPriority.sass'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import PriorityIcon from './../PriorityIcon'
import UserInfo from './../task-card-modal/UserInfo'


function TaskPriority({ task, mutate }) {
  const priority = [
    'very_low',
    'low',
    'medium',
    'high',
    'very_high'
  ]
  const dispatch = useDispatch()
  const [editPriorityVisible, setEditPriorityVisible] = React.useState(false)

  const toggleEditPriorityButton = () => setEditPriorityVisible(!editPriorityVisible)

  const editPriorityOnClick = () => {
    setEditPriorityVisible(true)
    setTimeout(() => {
      document.getElementById('priority-select').focus()
    }, 50)
  }
  const editPriorityOnChange = (e, newPriority) => {
    editPriority(newPriority)
    setEditPriorityVisible(false)
  }

  const editPriority = (newPriority) => {
    const payload = {
      priority: newPriority,
    }
    apiClient.put(`/api/tasks/${task.id}`, payload)
      .then((response) => {
        // successful request
        mutate({ ...task, priorities: [...task?.priority || [], response.data] })
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  return (
    <Box className='TaskPriority'>
      {task.priority ? <Box>
        {!editPriorityVisible ? (
          <IconButton onClick={editPriorityOnClick} className='TaskPriority-button'>
            <PriorityIcon size='xl' taskPriority={task.priority} />
          </IconButton>
        ) : (
          <Autocomplete
            id='priority-select'
            open={true}
            onChange={editPriorityOnChange}
            onOpen={() => {
              setEditPriorityVisible(true)
            }}
            onClose={() => {
              setEditPriorityVisible(false)
            }}
            onBlur={toggleEditPriorityButton}
            options={priority}
            renderInput={(params) => (
              <TextField {...params} label='Priority' />
            )}
          />)
        }
      </Box> :
        <Box>
          {!editPriorityVisible ? (
            <Box onClick={editPriorityOnClick} className='TaskPriority-add-button'>
              <Avatar className='TaskPriority-avatar' alt='Add priority'>
                <FontAwesomeIcon icon={faPlus} />
              </Avatar>
              <UserInfo userName='Add' />
            </Box>
          ) : (
            <Autocomplete
              id='priority-select'
              open={true}
              onChange={editPriorityOnChange}
              onOpen={() => {
                setEditPriorityVisible(true)
              }}
              onClose={() => {
                setEditPriorityVisible(false)
              }}
              onBlur={toggleEditPriorityButton}
              options={priority}
              renderInput={(params) => (
                <TextField {...params} label='Priority' />
              )}
            />)
          }
        </Box>
      }
    </Box>
  )
}

TaskPriority.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskPriority
