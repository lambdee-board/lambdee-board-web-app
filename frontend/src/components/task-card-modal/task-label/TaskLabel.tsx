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
    <div>
      <Typography
        variant='h6'
        onClick={isRegular() ? editTaskLabelOnClick : undefined}
        sx={{ display: 'block', width: 'fit-content', px: 0.5, py: 0.25, mx: -0.5, cursor: 'pointer', transition: '.1s ease-in', '&:hover': { backgroundColor: '#DCDCDC', borderRadius: '8px' } }}
      >
        {task.name}
      </Typography>
    </div>
  )

  return (
    <div>
      <Card sx={{ mx: -1, px: 1, display: 'flex' }}>
        <InputBase
          ref={editTaskLabelRef}
          sx={{ mt: 0.75, '& textarea': { pt: 1, pb: 0.25, fontSize: '1.25rem', fontWeight: 500, lineHeight: '0.0075em' } }}
          fullWidth
          multiline
          size='medium'
          defaultValue={task.name}
          onKeyDown={(e) => editTaskLabelInputOnKey(e)}
          onBlur={() => toggleEditTaskLabelButton()}
        />
        <IconButton sx={{ color: '#DCDCDC' }} onClick={() => toggleEditTaskLabelButton()}>
          <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faXmark} />
        </IconButton>
      </Card>
    </div>
  )
}

export default TaskLabel
