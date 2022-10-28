import * as React from 'react'
import PropTypes from 'prop-types'
import {
  IconButton,
  Typography,
  InputBase,
  Card
} from '@mui/material'
import { isRegular } from '../../permissions/RegularContent'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import './TaskLabel.sass'


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
    const updatedTask = { name: newLabel.value }
    if (!updatedTask.name) {
      setEditTaskLabelVisible(true)
      return
    }

    apiClient.put(`/api/tasks/${task.id}`, updatedTask)
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

  if (editTaskLabelButtonVisible) return (
    <div className='TaskLabel'>
      <Typography
        variant='h6'
        onClick={isRegular() ? editTaskLabelOnClick : undefined}
        className='TaskLabel-typography'
      >
        {task.name}
      </Typography>
    </div>
  )

  return (
    <div className='TaskLabel'>
      <Card className='TaskLabel-edit-input'>
        <InputBase
          ref={editTaskLabelRef}
          className='TaskLabel-edit-input-text'
          fullWidth
          multiline
          size='medium'
          defaultValue={task.name}
          onKeyDown={(e) => editTaskLabelInputOnKey(e)}
          onBlur={(e) => toggleEditTaskLabelButton()}
        />
        <IconButton className='TaskLabel-edit-input-cancel' onClick={() => toggleEditTaskLabelButton()}>
          <FontAwesomeIcon className='TaskLabel-edit-input-cancel-icon' icon={faXmark} />
        </IconButton>
      </Card>
    </div>
  )
}

TaskLabel.propTypes = {
  task: PropTypes.object.isRequired,
  mutate: PropTypes.func.isRequired
}

export default TaskLabel
