import * as React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { assign } from 'lodash'

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

import apiClient from '../../api/api-client'
import { mutateWorkspace } from '../../api/workspace'
import useAppAlertStore from '../../stores/app-alert'

import ColorPickerPopover from '../ColorPickerPopover'
import CustomAlert from '../CustomAlert'

import './WorkspaceBoard.sass'

const WorkspaceBoard = (props) => {
  const { workspaceId } = useParams()
  const [editBoardVisible, setEditBoardVisible] = React.useState(true)
  const [color, setColor] = React.useState()
  const editBoardRef = React.useRef()
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
    setColor(props.boardColor)
    setTimeout(() => {
      if (!editBoardRef.current) return
      const editInput = editBoardRef.current.children[0]
      editInput.focus()
    }, 25)
  }

  const editBoard = () => {
    const editInput = editBoardRef.current.children[0]
    const editedBoard = {}
    if ((!editInput.value || editInput.value === props.boardName) && props.boardColor === color) {
      setEditBoardVisible(true)
      return
    }
    if (editInput.value && editInput.value !== props.boardName) {
      editedBoard.name = editInput.value
    }
    if (props.boardColor !== color) {
      editedBoard.colour = color
    }

    apiClient.put(`/api/boards/${props.boardId}`, editedBoard)
      .then((response) => {
      // successful request
        mutateWorkspace({
          id: workspaceId,
          axiosOptions: { params: { boards: 'visible' } },
          data(currentWorkspace) {
            currentWorkspace = { ...currentWorkspace, boards: [...currentWorkspace.boards] }
            const currentBoard = currentWorkspace.boards.find((board) => board.id === props.boardId)
            assign(currentBoard, editedBoard) // mutating `currentBoard` with updated data!
            return currentWorkspace
          }
        })
        toggleEditBoard()
      })
      .catch((error) => {
      // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editBoardInputOnKey = (e) => {
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
    apiClient.delete(`/api/boards/${props.boardId}`)
      .then((response) => {
        addAlert({ severity: 'success', message: 'Board deleted!' })
        mutateWorkspace({
          id: workspaceId,
          axiosOptions: { params: { boards: 'visible' } },
          data(currentWorkspace) {
            const updatedBoards = currentWorkspace.boards.filter((board) => board.id !== props.boardId)
            return { ...currentWorkspace, boards: [...updatedBoards] }
          }
        })
      })
      .catch((error) => {
        // failed or rejected
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
            message={`Are you sure you want to delete ${props.boardName}?`}
            confirmMessage='Confirm, delete Board' />
        </Box>
      </Modal>
      {!editBoardVisible &&
        <ClickAwayListener onClickAway={toggleEditBoard}>
          <Box>
            <Box className='New-board'>
              <ColorPickerPopover color={color} onChange={setColor} />
              <InputBase
                ref={editBoardRef}
                className='New-board-input'
                fullWidth
                multiline
                defaultValue={props.boardName}
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
        <ListItem button divider>
          <Box className='BoardListItem' onClick={(e) => { editBoardOnClick() }}>
            <ListItemIcon>
              {props.icon}
            </ListItemIcon>
            <ListItemText primary={props.boardName} />
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


WorkspaceBoard.propTypes = {
  icon: PropTypes.object.isRequired,
  boardId: PropTypes.number,
  boardName: PropTypes.string.isRequired,
  boardColor: PropTypes.string,
}
