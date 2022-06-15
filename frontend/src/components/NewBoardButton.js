import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Skeleton,
  InputBase,
  IconButton,
  Typography,
  ClickAwayListener
} from '@mui/material'
import {
  faClipboardList,
  faScroll,
  faGear,
  faUsers,
  faArrowLeft,
  faPlus,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled, useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import useWorkspace from '../api/useWorkspace'
import apiClient from '../api/apiClient'
import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'

import ColorPickerPopover from './ColorPickerPopover'

import './NewBoardButton.sass'

export default function NewBoardButton() {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { data: workspace, mutate, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
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
          <Box className='Sidebar-new-board'>
            <ColorPickerPopover color={color} onChange={setColor} />
            <InputBase
              ref={newBoardInputRef}
              className='Sidebar-new-board-input'
              fullWidth
              multiline
              placeholder='Board Label'
              onKeyDown={(e) => newBoardNameInputOnKey(e)}
            />
            <IconButton className='Sidebar-new-board-cancel' onClick={() => toggleNewBoardButton()}>
              <FontAwesomeIcon className='Sidebar-new-board-cancel-icon' icon={faXmark} />
            </IconButton>
          </Box>
        </ClickAwayListener>
      }

      <Box className='Sidebar-new-board-wrapper'>
        {newBoardButtonVisible &&
      <Button onClick={newBoardButtonOnClick} className='Sidebar-new-board-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
        <Typography>New Board</Typography>
      </Button>
        }
      </Box>
    </Box>
  )
}
