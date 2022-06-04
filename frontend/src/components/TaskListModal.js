import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, ClickAwayListener, IconButton, FilledInput, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { mutateBoard } from '../api/useBoard'
import { mutateList } from '../api/useList'
import { addAlert } from '../redux/slices/appAlertSlice'
import './TaskListModal.sass'

export default function TaskListModal(props) {
  const { boardId } = useParams()
  const [editingListTitle, changeEditingListTitle] = React.useState(false)
  const editListTitleRef = React.useRef()
  const dispatch = useDispatch()
  const toggleListTitleEditing = () => {
    changeEditingListTitle(!editingListTitle)
  }

  const editListTitleOnClick = () => {
    toggleListTitleEditing()
    setTimeout(() => {
      if (!editListTitleRef.current) return

      const nameInput = editListTitleRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editListTitle = () => {
    const nameInput = editListTitleRef.current.children[0]
    const editedList = {
      name: nameInput.value,
    }
    apiClient.put(`/api/lists/${props.listId}`, editedList)
      .then((response) => {
        // successful request
        mutateList(props.listId, { params: { tasks: 'all' } })
        mutateBoard(boardId, { params: { lists: 'visible' } })
        toggleListTitleEditing()
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const deleteTaskList = () => {
    const deleteList = {
      deleted: true,
    }
    apiClient.delete(`/api/lists/${props.listId}`, deleteList)
      .then((response) => {
        // successful request
        mutateBoard(1, { params: { lists: 'visible' } })
        dispatch(addAlert({ severity: 'success', message: 'List deleted!' }))
      })
      .catch((error) => {
        // failed or rejected
        console.log(error)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  const editListTitleOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editListTitle()
      break
    case 'Escape':
      e.preventDefault()
      toggleListTitleEditing()
      break
    }
  }

  return (
    <div className='TaskListModal-wrapper'>
      <Card className='TaskListModal-card'>
        <div className='TaskListModal-main'>
          <div className='TaskListModal-main-header'>
            { !editingListTitle &&
              <Typography
                className='TaskListModal-main-header-text'
                onClick={() => editListTitleOnClick()}>
                {props.title}
              </Typography>
            }
            { editingListTitle &&
              <ClickAwayListener onClickAway={toggleListTitleEditing}>
                <FilledInput
                  ref={editListTitleRef}
                  variant='filled'
                  fullWidth
                  className='TaskListModal-edit-title-input'
                  color='secondary'
                  placeholder='New List Name'
                  defaultValue={props.title}
                  onKeyDown={(e) => editListTitleOnKey(e)}
                  endAdornment={
                    <IconButton
                      className='TaskListModal-edit-title-cancel'
                      onClick={() => toggleListTitleEditing()}>
                      <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                  }
                />
              </ClickAwayListener>
            }
          </div>
          <div className='TaskListModal-main-item'>
            <Button
              className='TaskListModal-main-delete-button'
              variant='contained'
              color='error'
              onClick={() => deleteTaskList()}>
              <Typography>Delete List</Typography>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
TaskListModal.propTypes = {
  listId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}
