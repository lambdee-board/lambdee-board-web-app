import * as React from 'react'

import {
  Box,
  IconButton,
  InputBase,
  Avatar
} from '@mui/material'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { isRegular } from '../../../internal/permissions'
import apiClient from '../../../api/axios-client'
import useAppAlertStore from '../../../stores/app-alert'
import type { TaskWithAssociations } from '../../../types'

import UserInfo from '../UserInfo'


interface Props {
  task: TaskWithAssociations
  mutate: (data?: unknown, options?: unknown) => void
}

function TaskPoints({ task, mutate }: Props) {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editPointsVisible, setEditPointsVisible] = React.useState(false)

  const toggleEditPointsButton = () => setEditPointsVisible(!editPointsVisible)
  const editPointsRef = React.useRef<HTMLDivElement>(null)

  const editPointsOnClick = () => {
    toggleEditPointsButton()
    setTimeout(() => {
      if (!editPointsRef.current) return

      const nameInput = editPointsRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const editPoints = () => {
    const newPoints = editPointsRef.current!.children[0] as HTMLInputElement
    const updatedTask = { points: parseInt(newPoints.value) || 0 }

    apiClient.put(`/api/tasks/${task.id}`, updatedTask)
      .then((response) => {
        mutate({ ...task, points: response.data.points }, { revalidate: false })
        toggleEditPointsButton()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editPointsIfGiven = () => {
    const newPoints = editPointsRef.current!.children[0] as HTMLInputElement
    if (newPoints.value === '') return toggleEditPointsButton()

    editPoints()
  }

  const editPointsInputOnKey = (e: React.KeyboardEvent) => {
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
    <div>
      <Box sx={{ color: '#7d7b7b', cursor: 'pointer', display: 'flex', alignItems: 'center', textAlign: 'center', transition: '.1s ease-in', '&:hover': { opacity: 0.8 } }}>
        <Avatar alt='Add points'>
          <InputBase
            ref={editPointsRef}
            onKeyDown={(e) => editPointsInputOnKey(e)}
            onBlur={() => editPointsIfGiven()}
            type='text'
            inputProps={{ inputMode: 'numeric', pattern: '\\d*', maxLength: 2, style: { color: 'white', fontSize: '1.25rem', textAlign: 'center', width: '100%', height: '100%' } }}
            sx={{ width: '100%', height: '100%' }}
          />
        </Avatar>
      </Box>
    </div>
  )

  return (
    <div>
      {task.points ? (
        <IconButton sx={{ p: 0, m: 0 }} onClick={isRegular() ? editPointsOnClick : undefined}>
          <Avatar>{task.points}</Avatar>
        </IconButton>
      ) : (
        <Box onClick={editPointsOnClick} sx={{ color: '#7d7b7b', cursor: 'pointer', display: 'flex', alignItems: 'center', textAlign: 'center', transition: '.1s ease-in', '&:hover': { opacity: 0.8 } }}>
          <Avatar alt='Add points'>
            <FontAwesomeIcon icon={faPlus} />
          </Avatar>
          <UserInfo userName='Add' />
        </Box>
      )}
    </div>
  )
}

export default TaskPoints
