import * as React from 'react'

import {
  Box,
  IconButton,
  Avatar,
  Autocomplete,
  TextField
} from '@mui/material'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { isRegular } from '../../../internal/permissions'
import apiClient from '../../../api/axios-client'
import useAppAlertStore from '../../../stores/app-alert'
import priorities from '../../../internal/priorities'
import type { Priority } from '../../../internal/priorities'
import type { TaskWithAssociations } from '../../../types'

import UserInfo from '../UserInfo'
import PriorityIcon from '../../priority-icon/PriorityIcon'

import './TaskPriority.sass'

interface Props {
  task: TaskWithAssociations
  mutate: (data?: unknown, options?: unknown) => void
}

function TaskPriority({ task, mutate }: Props) {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editPriorityVisible, setEditPriorityVisible] = React.useState(false)

  const toggleEditPriorityButton = () => setEditPriorityVisible(!editPriorityVisible)

  const editPriorityOnClick = () => {
    setEditPriorityVisible(true)
    setTimeout(() => {
      document.getElementById('priority-select')?.focus()
    }, 50)
  }

  const editPriority = (e: React.SyntheticEvent, newPriority: Priority | null) => {
    const payload = { priority: newPriority?.symbol }

    apiClient.put(`/api/tasks/${task.id}`, payload)
      .then((response) => {
        mutate({ ...task, priority: response.data.priority }, { revalidate: false })
        setEditPriorityVisible(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (editPriorityVisible) return (
    <Autocomplete
      id='priority-select'
      open={true}
      onChange={editPriority}
      onOpen={() => setEditPriorityVisible(true) }
      onClose={() => setEditPriorityVisible(false)}
      isOptionEqualToValue={(option, other) => option.symbol === other.symbol}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
      onBlur={toggleEditPriorityButton}
      options={priorities}
      renderInput={(params) => (
        <TextField {...params} label='Add' />
      )}
    />
  )


  return (
    <Box className='TaskPriority'>
      {task.priority ? (<Box>
        <IconButton onClick={isRegular() ? editPriorityOnClick : undefined} className='TaskPriority-button'>
          <PriorityIcon size='xl' taskPriority={task.priority} />
        </IconButton>
      </Box>) :
        <Box>
          <Box onClick={editPriorityOnClick} className='TaskPriority-add-button'>
            <Avatar className='TaskPriority-avatar' alt='Add priority'>
              <FontAwesomeIcon icon={faPlus} />
            </Avatar>
            <UserInfo userName='Add' />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default TaskPriority
