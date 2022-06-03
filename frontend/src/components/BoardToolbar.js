import React from 'react'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Toolbar, Button, Typography, IconButton, ClickAwayListener, OutlinedInput } from '@mui/material'

import apiClient from '../api/apiClient'
import { addAlert } from '../redux/slices/appAlertSlice'
import { mutateBoard } from '../api/useBoard'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import './BoardToolbar.sass'


export default function BoardToolbar(props) {
  const { boardId } = useParams()
  const [newLitButtonVisible, setNewListButton] = React.useState(true)
  const newListInputRef = React.useRef()
  const dispatch = useDispatch()

  const toggleNewListButton = () => setNewListButton(!newLitButtonVisible)

  const newListButtonOnClick = () => {
    toggleNewListButton()
    setTimeout(() => {
      if (!newListInputRef.current) return

      const nameInput = newListInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const createNewList = () => {
    const nameInput = newListInputRef.current.children[0]
    const newList = {
      name: nameInput.value,
      boardId
    }

    apiClient.post('/api/lists', newList)
      .then((response) => {
        // successful request
        mutateBoard(boardId, { params: { lists: 'visible' } })
        dispatch(addAlert({ severity: 'success', message: 'New List Created!' }))
        toggleNewListButton()
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  const newListNameInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      createNewList()
      break
    case 'Escape':
      e.preventDefault()
      toggleNewListButton()
      break
    }
  }

  return (
    <div className='Toolbar-wrapper'>
      <Toolbar className='Toolbar'>
        { newLitButtonVisible &&
          <Button onClick={() => newListButtonOnClick()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Create New List</Typography>
          </Button>
        }
        { !newLitButtonVisible &&
        <ClickAwayListener onClickAway={toggleNewListButton}>
          <OutlinedInput
            ref={newListInputRef}
            variant='standard'
            className='Toolbar-new-list-input'
            color='secondary'
            placeholder='New List Name'
            onKeyDown={(e) => newListNameInputOnKey(e)}
            endAdornment={
              <IconButton
                className='Toolbar-new-list-cancel'
                onClick={() => toggleNewListButton()}>
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            }
          />
        </ClickAwayListener>
        }
      </Toolbar>
    </div>
  )
}
