import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'

import apiClient from '../api/api-client'
import { mutateBoard } from '../api/board'
import { mutateList } from '../api/list'
import useAppAlertStore from '../stores/app-alert'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, ClickAwayListener, IconButton, FilledInput, Typography } from '@mui/material'

import './TaskListModal.sass'

export default function TaskListModal(props) {
  const { boardId } = useParams()
  const [editingListTitle, setEditingListTitle] = React.useState(false)
  const editListTitleRef = React.useRef()
  const addAlert = useAppAlertStore((store) => store.addAlert)

  const editListTitleOnClick = () => {
    setEditingListTitle(true)
    setTimeout(() => {
      if (!editListTitleRef.current) return

      const nameInput = editListTitleRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editListTitle = () => {
    const nameInput = editListTitleRef.current.children[0]
    if (!nameInput.value) {
      setEditingListTitle(false)
      return
    }

    const editedList = { name: nameInput.value }

    apiClient.put(`/api/lists/${props.listId}`, editedList)
      .then((response) => {
        // successful request
        mutateList({ id: props.listId, axiosOptions: { params: { tasks: 'all' } } })
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: props.listVisibility } } })
        setEditingListTitle(false)
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteTaskList = () => {
    apiClient.delete(`/api/lists/${props.listId}`)
      .then((response) => {
        // successful request
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: props.listVisibility } } })
        addAlert({ severity: 'success', message: 'List deleted!' })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
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
      setEditingListTitle(false)
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
              <ClickAwayListener onClickAway={() => setEditingListTitle(false)}>
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
                      onClick={() => setEditingListTitle(false)}>
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
  listVisibility: PropTypes.string.isRequired
}
