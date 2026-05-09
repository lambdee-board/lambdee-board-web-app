import * as React from 'react'

import {
  IconButton,
  Typography,
  InputBase,
  Card
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { isRegular } from '../../../internal/permissions'
import apiClient from '../../../api/axios-client'
import useAppAlertStore from '../../../stores/app-alert'
import type { TaskWithAssociations } from '../../../types'

import './TaskLabel.sass'

interface Props {
  task: TaskWithAssociations
  mutate: (data?: unknown, options?: unknown) => void
}

function TaskLabel({ task, mutate }: Props) {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editTaskLabelButtonVisible, setEditTaskLabelVisible] = React.useState(true)

  const toggleEditTaskLabelButton = () => setEditTaskLabelVisible(!editTaskLabelButtonVisible)
  const editTaskLabelRef = React.useRef<HTMLDivElement>(null)

  const editTaskLabelOnClick = () => {
    toggleEditTaskLabelButton()
    setTimeout(() => {
      if (!editTaskLabelRef.current) return

      const nameInput = editTaskLabelRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const editTaskLabel = () => {
    const newLabel = editTaskLabelRef.current!.children[0] as HTMLInputElement
    const updatedTask = { name: newLabel.value }
    if (!updatedTask.name) {
      setEditTaskLabelVisible(true)
      return
    }

    apiClient.put(`/api/tasks/${task.id}`, updatedTask)
      .then((response) => {
        mutate({ ...task, name: response.data.name }, { revalidate: false })
        toggleEditTaskLabelButton()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editTaskLabelInputOnKey = (e: React.KeyboardEvent) => {
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
          onBlur={() => toggleEditTaskLabelButton()}
        />
        <IconButton className='TaskLabel-edit-input-cancel' onClick={() => toggleEditTaskLabelButton()}>
          <FontAwesomeIcon className='TaskLabel-edit-input-cancel-icon' icon={faXmark} />
        </IconButton>
      </Card>
    </div>
  )
}

export default TaskLabel
