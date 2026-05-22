import * as React from 'react'
import { useParams } from 'react-router-dom'
import { assign } from 'lodash'
import { ReactElement } from 'react'

import {
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
  Divider,
  InputBase,
  IconButton,
  Modal
} from '@mui/material'
import {
  faXmark,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '../../../api/axios-client'
import { mutateWorkspace } from '../../../api/workspace'
import useAppAlertStore from '../../../stores/app-alert'

import ColorPickerPopover from '../../ColorPickerPopover'
import CustomAlert from '../../custom-alert/CustomAlert'

import './WorkspaceBoard.sass'

interface Props {
  icon: ReactElement
  boardId?: number
  boardName: string
  boardColor?: string
}

const WorkspaceBoard = ({ icon, boardId, boardName, boardColor }: Props) => {
  const { workspaceId } = useParams()
  const [editBoardVisible, setEditBoardVisible] = React.useState(true)
  const [color, setColor] = React.useState<string | undefined>()
  const editBoardRef = React.useRef<HTMLDivElement>(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const toggleEditBoard = () => {
    setEditBoardVisible(!editBoardVisible)
  }

  const editBoardOnClick = () => {
    toggleEditBoard()
    setColor(boardColor)
    setTimeout(() => {
      if (!editBoardRef.current) return
      const editInput = editBoardRef.current.children[0] as HTMLInputElement
      editInput.focus()
    }, 25)
  }

  const editBoard = () => {
    const editInput = editBoardRef.current!.children[0] as HTMLInputElement
    const editedBoard: { name?: string; color?: string } = {}
    if ((!editInput.value || editInput.value === boardName) && boardColor === color) {
      setEditBoardVisible(true)
      return
    }
    if (editInput.value && editInput.value !== boardName) {
      editedBoard.name = editInput.value
    }
    if (boardColor !== color) {
      editedBoard.color = color
    }

    apiClient.put(`/api/boards/${boardId}`, editedBoard)
      .then((response) => {
        mutateWorkspace({
          id: workspaceId,
          axiosOptions: { params: { boards: 'visible' } },
          data(currentWorkspace) {
            currentWorkspace = { ...currentWorkspace, boards: [...currentWorkspace.boards!] }
            const currentBoard = currentWorkspace.boards!.find((board) => board.id === boardId)
            assign(currentBoard, editedBoard)
            return currentWorkspace
          }
        })
        toggleEditBoard()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editBoardInputOnKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editBoard()
      break
    case 'Escape':
      e.preventDefault()
      editBoard()
      break
    }
  }

  const deleteBoard = () => {
    apiClient.delete(`/api/boards/${boardId}`)
      .then((response) => {
        addAlert({ severity: 'success', message: 'Board deleted!' })
        mutateWorkspace({
          id: workspaceId,
          axiosOptions: { params: { boards: 'visible' } },
          data(currentWorkspace) {
            const updatedBoards = currentWorkspace.boards!.filter((board) => board.id !== boardId)
            return { ...currentWorkspace, boards: [...updatedBoards] }
          }
        })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  return (
    <Box>
      <Modal
        open={alertModalState}
        onClose={toggleAlertModalState}
      >
        <Box
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <CustomAlert confirmAction={deleteBoard}
            dismissAction={toggleAlertModalState}
            title='Delete Board?'
            message={`Are you sure you want to delete ${boardName}?`}
            confirmMessage='Confirm, delete Board' />
        </Box>
      </Modal>
      {!editBoardVisible &&
        <ClickAwayListener onClickAway={toggleEditBoard}>
          <Box>
            <Box className='New-board'>
              <ColorPickerPopover color={color || '#1082F3'} onChange={setColor} />
              <InputBase
                ref={editBoardRef}
                className='New-board-input'
                fullWidth
                multiline
                defaultValue={boardName}
                onKeyDown={(e) => editBoardInputOnKey(e)}
              />
              <IconButton className='New-board-cancel' onClick={() => toggleEditBoard()}>
                <FontAwesomeIcon className='New-board-cancel-icon' icon={faXmark} />
              </IconButton>
            </Box>
            <Divider />
          </Box>
        </ClickAwayListener>
      }
      {editBoardVisible &&
        <ListItem divider>
          <Box className='BoardListItem' onClick={() => { editBoardOnClick() }}>
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText primary={boardName} />
          </Box>
          <IconButton onClick={toggleAlertModalState}>
            <FontAwesomeIcon className='DeleteBoard-icon' icon={faTrash} />
          </IconButton>
        </ListItem>
      }
    </Box>
  )
}
export default WorkspaceBoard
