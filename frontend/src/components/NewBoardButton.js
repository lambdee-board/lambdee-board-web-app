import * as React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  InputBase,
  IconButton,
  Typography,
  ClickAwayListener
} from '@mui/material'
import {
  faPlus,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useWorkspace from '../api/useWorkspace'
import apiClient from '../api/apiClient'
import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'

import ColorPickerPopover from './ColorPickerPopover'

import './NewBoardButton.sass'

export default function NewBoardButton() {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { data: workspace, mutate } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const [color, setColor] = React.useState('#1082F3')
  const [newBoardButtonVisible, setNewBoardButtonVisible] = React.useState(true)
  const toggleNewBoardButton = () => setNewBoardButtonVisible(!newBoardButtonVisible)
  const newBoardInputRef = React.useRef()

  const newBoardButtonOnClick = () => {
    toggleNewBoardButton()
    setTimeout(() => {
      if (!newBoardInputRef.current) return
      const nameInput = newBoardInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }
  const newBoardNameInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      createNewBoard()
      break
    case 'Escape':
      e.preventDefault()
      toggleNewBoardButton()
      break
    }
  }
  const createNewBoard = () => {
    const nameInput = newBoardInputRef.current.children[0]
    if (!nameInput.value) {
      toggleNewBoardButton()
      return
    }
    const newBoard = {
      name: nameInput.value,
      workspaceId: workspace.id,
      colour: color,
    }
    apiClient.post('/api/boards', newBoard)
      .then((response) => {
        // successful request
        mutate({ ...workspace, boards: [...workspace?.boards || [], response.data] })
        toggleNewBoardButton()
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  return (
    <Box>
      {!newBoardButtonVisible &&
        <ClickAwayListener onClickAway={toggleNewBoardButton}>
          <Box className='New-board'>
            <ColorPickerPopover color={color} onChange={setColor} />
            <InputBase
              ref={newBoardInputRef}
              className='New-board-input'
              fullWidth
              multiline
              placeholder='Board Name'
              onKeyDown={(e) => newBoardNameInputOnKey(e)}
            />
            <IconButton className='New-board-cancel' onClick={() => toggleNewBoardButton()}>
              <FontAwesomeIcon className='New-board-cancel-icon' icon={faXmark} />
            </IconButton>
          </Box>
        </ClickAwayListener>
      }

      <Box className='New-board-wrapper'>
        {newBoardButtonVisible &&
      <Button onClick={newBoardButtonOnClick} className='New-board-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
        <Typography>Add New Board</Typography>
      </Button>
        }
      </Box>
    </Box>
  )
}
