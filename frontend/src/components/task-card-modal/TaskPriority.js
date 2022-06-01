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
import './TaskPriority.sass'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import PriorityIcon from './../PriorityIcon'
import UserInfo from './../task-card-modal/UserInfo'


function TaskPriority({ task, mutate }) {
  // const dispatch = useDispatch()
  const [editPriorityVisible, setEditPriorityVisible] = React.useState(false)

  // const toggleEditTaskLabelButton = () => setEditTaskLabelVisible(!editTaskLabelButtonVisible)
  // const editTaskLabelRef = React.useRef()

  // const editTaskLabelOnClick = () => {
  //   toggleEditTaskLabelButton()
  //   setTimeout(() => {
  //     if (!editTaskLabelRef.current) return

  //     const nameInput = editTaskLabelRef.current.children[0]
  //     nameInput.focus()
  //   }, 25)
  // }

  // const editTaskLabel = () => {
  //   const newLabel = editTaskLabelRef.current.children[0]
  //   const updatedLabel = {
  //     name: newLabel.value,

  //   }
  //   apiClient.put(`/api/tasks/${task.id}`, updatedLabel)
  //     .then((response) => {
  //       // successful request
  //       mutate({ ...task, names: [...task?.name || [], response.data] })
  //       toggleEditTaskLabelButton()
  //     })
  //     .catch((error) => {
  //       // failed or rejected
  //       console.log(error)
  //       dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
  //     })
  // }

  // const editTaskLabelInputOnKey = (e) => {
  //   switch (e.key) {
  //   case 'Enter':
  //     e.preventDefault()
  //     editTaskLabel()
  //     break
  //   case 'Escape':
  //     e.preventDefault()
  //     toggleEditTaskLabelButton()
  //     break
  //   }
  // }
  return (
    <Box className='TaskPriority'>
      {task.priority ? <Box>
        {!editPriorityVisible ? (
          <IconButton className='TaskPriority-button'>
            <PriorityIcon size='xl' taskPriority={task.priority} />
          </IconButton>
        ) : (<Box />)
        }
      </Box> :
        <Box className='TaskPriority-add-button'>
          <Avatar className='TaskPriority-avatar' alt='Add priority'>
            <FontAwesomeIcon icon={faPlus} />
          </Avatar>
          <UserInfo userName='Add' />
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
