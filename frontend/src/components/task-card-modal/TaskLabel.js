import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Typography,
  InputBase,
  Card
} from '@mui/material'
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './TaskLabel.sass'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'


function TaskLabel({ task, mutate }) {
  const dispatch = useDispatch()
  const [editTaskLabelButtonVisible, setEditTaskLabelVisible] = React.useState(true)

  const toggleEditTaskLabelButton = () => setEditTaskLabelVisible(!editTaskLabelButtonVisible)
  const editTaskLabelRef = React.useRef()

  const editTaskLabelOnClick = () => {
    toggleEditTaskLabelButton()
    setTimeout(() => {
      if (!editTaskLabelRef.current) return

      const nameInput = editTaskLabelRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editTaskLabel = () => {
    const newLabel = editTaskLabelRef.current.children[0]
    const updatedLabel = { name: newLabel.value }
    apiClient.put(`/api/tasks/${task.id}`, updatedLabel)
      .then((response) => {
        // successful request
        mutate({ ...task, name: newLabel.value })
        toggleEditTaskLabelButton()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const editTaskLabelInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editTaskLabel()
      break
    case 'Escape':
      e.preventDefault()
      toggleEditTaskLabelButton()
      break
    }
  }

  return (
    <Box>
      {editTaskLabelButtonVisible &&
      <Typography variant='h6'>
        {task.name}
        <IconButton onClick={editTaskLabelOnClick}>
          <FontAwesomeIcon className='TaskLabel-icon' icon={faPencil} />
        </IconButton>
      </Typography>
      }

      {!editTaskLabelButtonVisible &&
          <Card className='TaskLabel-edit-input'>
            <InputBase
              ref={editTaskLabelRef}
              className='TaskLabel-edit-input-text'
              fullWidth
              multiline
              defaultValue={task.name}
              onKeyDown={(e) => editTaskLabelInputOnKey(e)}
              onBlur={(e) => toggleEditTaskLabelButton()}
            />
            <IconButton className='TaskLabel-edit-input-cancel' onClick={() => toggleEditTaskLabelButton()}>
              <FontAwesomeIcon className='TaskLabel-edit-input-cancel-icon' icon={faXmark} />
            </IconButton>
          </Card>
      }
    </Box>
  )
}

TaskLabel.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskLabel
