import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
  Divider,
  InputBase,
  IconButton
} from '@mui/material'
import {
  faXmark,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addAlert } from '../../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import ColorPickerPopover from '../../components/ColorPickerPopover'
import './BoardListItem.sass'


const BoardListItem = (props) => {
  const [editBoardVisible, setEditBoardVisible] = React.useState(true)
  const [color, setColor] = React.useState()
  const editBoardRef = React.useRef()
  const dispatch = useDispatch()

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
    const payload = {
      name: editInput.value,
      colour: color,
    }
    apiClient.put(`/api/boards/${props.boardId}`, payload)
      .then((response) => {
      // successful request
        props.mutate()
        toggleEditBoard()
      })
      .catch((error) => {
      // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
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
        dispatch(addAlert({ severity: 'success', message: 'Board deleted!' }))
        props.mutate()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  return (
    <Box>
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
          <IconButton onClick={deleteBoard}>
            <FontAwesomeIcon className='DeleteBoard-icon' icon={faTrash} />
          </IconButton>
        </ListItem>
      }
    </Box>
  )
}
export default BoardListItem


BoardListItem.propTypes = {
  icon: PropTypes.object.isRequired,
  boardId: PropTypes.number,
  boardName: PropTypes.string.isRequired,
  boardColor: PropTypes.string,
  workspace: PropTypes.object,
  mutate: PropTypes.func
}
