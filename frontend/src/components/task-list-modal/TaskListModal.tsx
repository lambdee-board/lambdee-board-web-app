import React from 'react'
import { useParams } from 'react-router-dom'

import apiClient from '../../api/axios-client'
import { mutateBoard } from '../../api/board'
import { mutateList } from '../../api/list'
import useAppAlertStore from '../../stores/app-alert'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, ClickAwayListener, IconButton, FilledInput, Typography, Modal, Box } from '@mui/material'

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
    <div style={{ width: '400px' }}>
      <Card sx={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
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
        <Box sx={{ height: '160px', m: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            { !editingListTitle &&
              <Typography
                sx={{ fontSize: '32px', textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: '#77777710' } }}
                onClick={() => editListTitleOnClick()}>
                {title}
              </Typography>
            }
            { editingListTitle &&
              <ClickAwayListener onClickAway={() => setEditingListTitle(false)}>
                <FilledInput
                  ref={editListTitleRef}
                  fullWidth
                  color='secondary'
                  placeholder='New List Name'
                  defaultValue={title}
                  onKeyDown={(e) => editListTitleOnKey(e)}
                  sx={{ '& .MuiFilledInput-input': { fontSize: '24px', py: 0, px: 1 } }}
                  endAdornment={
                    <IconButton onClick={() => setEditingListTitle(false)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                  }
                />
              </ClickAwayListener>
            }
          </div>
          <Box sx={{ my: 1 }}>
            <Button
              sx={{ width: '100%' }}
              variant='contained'
              color='error'
              onClick={toggleAlertModalState}>
              <Typography>Delete List</Typography>
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  )
}
