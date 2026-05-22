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

import useWorkspace from '../../api/workspace'
import apiClient from '../../api/axios-client'
import useAppAlertStore from '../../stores/app-alert'

import ColorPickerPopover from '../ColorPickerPopover'


export default function NewBoardButton() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { workspaceId } = useParams()
  const { data: workspace, mutate } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  const [color, setColor] = React.useState('#1082F3')
  const [newBoardButtonVisible, setNewBoardButtonVisible] = React.useState(true)
  const toggleNewBoardButton = () => setNewBoardButtonVisible(!newBoardButtonVisible)
  const newBoardInputRef = React.useRef<HTMLDivElement>(null)

  const newBoardButtonOnClick = () => {
    toggleNewBoardButton()
    setTimeout(() => {
      if (!newBoardInputRef.current) return
      const nameInput = newBoardInputRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }
  const newBoardNameInputOnKey = (e: React.KeyboardEvent) => {
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
    const nameInput = newBoardInputRef.current!.children[0] as HTMLInputElement
    if (!nameInput.value) {
      toggleNewBoardButton()
      return
    }
    const newBoard = {
      name: nameInput.value,
      workspaceId: workspace.id,
      color: color,
    }
    apiClient.post('/api/boards', newBoard)
      .then((response) => {
        mutate({ ...workspace, boards: [...(workspace?.boards || []), response.data] }, { revalidate: false })
        toggleNewBoardButton()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  return (
    <Box>
      {!newBoardButtonVisible &&
        <ClickAwayListener onClickAway={toggleNewBoardButton}>
          <Box sx={{ pl: 1.5, pt: 0.75, pr: 1, display: 'flex' }}>
            <ColorPickerPopover color={color} onChange={setColor} />
            <InputBase
              ref={newBoardInputRef}
              sx={{ mr: 'auto' }}
              fullWidth
              multiline
              placeholder='Board Name'
              onKeyDown={(e) => newBoardNameInputOnKey(e)}
            />
            <IconButton sx={{ margin: 'auto', color: '#DCDCDC' }} onClick={() => toggleNewBoardButton()}>
              <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faXmark} />
            </IconButton>
          </Box>
        </ClickAwayListener>
      }

      <Box>
        {newBoardButtonVisible &&
          <Button onClick={newBoardButtonOnClick} sx={{ textTransform: 'none', justifyContent: 'flex-start', width: '100%', p: 1.5, pl: 2 }} color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Add New Board</Typography>
          </Button>
        }
      </Box>
    </Box>
  )
}
