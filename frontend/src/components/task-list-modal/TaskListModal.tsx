import React from 'react'
import { useParams } from 'react-router-dom'

import apiClient from '../../api/axios-client'
import { mutateBoard } from '../../api/board'
import { mutateList } from '../../api/list'
import useAppAlertStore from '../../stores/app-alert'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, ClickAwayListener, IconButton, FilledInput, Typography, Modal, Box } from '@mui/material'

import './TaskListModal.sass'
import CustomAlert from '../custom-alert/CustomAlert'

interface Props {
  listId: number
  title: string
  listVisibility: string
}

export default function TaskListModal({ listId, title, listVisibility }: Props) {
  const { boardId } = useParams()
  const [editingListTitle, setEditingListTitle] = React.useState(false)
  const editListTitleRef = React.useRef<HTMLDivElement>(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const editListTitleOnClick = () => {
    setEditingListTitle(true)
    setTimeout(() => {
      if (!editListTitleRef.current) return

      const nameInput = editListTitleRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const editListTitle = () => {
    const nameInput = editListTitleRef.current!.children[0] as HTMLInputElement
    if (!nameInput.value) {
      setEditingListTitle(false)
      return
    }

    const editedList = { name: nameInput.value }

    apiClient.put(`/api/lists/${listId}`, editedList)
      .then((response) => {
        mutateList({ id: listId, axiosOptions: { params: { tasks: 'all' } } })
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: listVisibility } } })
        setEditingListTitle(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteTaskList = () => {
    apiClient.delete(`/api/lists/${listId}`)
      .then((response) => {
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: listVisibility } } })
        addAlert({ severity: 'success', message: 'List deleted!' })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  const editListTitleOnKey = (e: React.KeyboardEvent) => {
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
            <CustomAlert confirmAction={deleteTaskList}
              dismissAction={toggleAlertModalState}
              title='Delete List?'
              message={`Are you sure you want to delete ${title}?`}
              confirmMessage='Confirm, delete List' />
          </Box>
        </Modal>
        <div className='TaskListModal-main'>
          <div className='TaskListModal-main-header'>
            { !editingListTitle &&
              <Typography
                className='TaskListModal-main-header-text'
                onClick={() => editListTitleOnClick()}>
                {title}
              </Typography>
            }
            { editingListTitle &&
              <ClickAwayListener onClickAway={() => setEditingListTitle(false)}>
                <FilledInput
                  ref={editListTitleRef}
                  fullWidth
                  className='TaskListModal-edit-title-input'
                  color='secondary'
                  placeholder='New List Name'
                  defaultValue={title}
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
              onClick={toggleAlertModalState}>
              <Typography>Delete List</Typography>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
