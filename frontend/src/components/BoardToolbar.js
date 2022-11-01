import React, { useEffect } from 'react'
import useCookie from 'react-use-cookie'
import { faPlus, faXmark, faList, faPersonRunning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Toolbar, Button, Typography, IconButton, ClickAwayListener, OutlinedInput, Modal, Box } from '@mui/material'
import { ManagerContent } from '../permissions/ManagerContent'


import apiClient from '../api/apiClient'
import { addAlert } from '../redux/slices/appAlertSlice'
import { mutateBoard } from '../api/useBoard'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import SprintModal from './SprintModal.js'
import './BoardToolbar.sass'


export default function BoardToolbar(props) {
  const { boardId, workspaceId } = useParams()
  const navigate = useNavigate()
  const [newListButtonVisible, setNewListButtonVisible] = React.useState(true)
  const [newSprintModal, setNewSprintModal] = React.useState(false)
  const [boardView, setBoardView] = useCookie('1')
  const newListInputRef = React.useRef()
  const dispatch = useDispatch()

  const handleCloseSprintModal = () => {
    setNewSprintModal(false)
  }

  const setBoardPlanningView = () => {
    setBoardView('0')
  }
  const setBoardWorkView = () => {
    setBoardView('1')
  }

  useEffect(() => {
    if (boardView === '1') {
      { navigate(`/workspaces/${workspaceId}/boards/${boardId}/work`) }
    } else {
      { navigate(`/workspaces/${workspaceId}/boards/${boardId}/planning`) }
    }
  }, [boardView, boardId, workspaceId, navigate])

  const newListButtonOnClick = () => {
    setNewListButtonVisible(false)
    setTimeout(() => {
      if (!newListInputRef.current) return

      const nameInput = newListInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const createNewList = () => {
    const nameInput = newListInputRef.current.children[0]
    if (!nameInput.value) {
      setNewListButtonVisible(true)
      return
    }

    const newList = {
      name: nameInput.value,
      boardId,
      visible: true
    }

    apiClient.post('/api/lists', newList)
      .then((response) => {
        // successful request
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
        mutateBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })
        dispatch(addAlert({ severity: 'success', message: 'New List Created!' }))
        setNewListButtonVisible(true)
      })
      .catch((error) => {
        // failed or rejected
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
      setNewListButtonVisible(true)
      break
    }
  }

  return (
    <div className='Toolbar-wrapper'>
      <Modal
        open={newSprintModal}
        onClose={handleCloseSprintModal}
      >
        <Box
          className='TaskList-Modal'
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <SprintModal closeModal={handleCloseSprintModal} />
        </Box>
      </Modal>
      <Toolbar className='Toolbar'>
        <ManagerContent>
          <Button sx={{ ml: '8px' }} onClick={() => setNewSprintModal(true)}
            className='Toolbar-create-spring-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faPersonRunning} />}
          >
            <Typography>Start Sprint</Typography>
          </Button>
        </ManagerContent>
      </Toolbar>
      <Toolbar className='Toolbar'>
        <ManagerContent>
          { newListButtonVisible &&
          <Button onClick={() => newListButtonOnClick()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            <Typography>Create New List</Typography>
          </Button>
          }
          { !newListButtonVisible &&
        <ClickAwayListener onClickAway={() => setNewListButtonVisible(true)}>
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
                onClick={() => setNewListButtonVisible(true)}>
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            }
          />
        </ClickAwayListener>

          }
        </ManagerContent>
        {boardView === '1' ?
          <div>
            <Button sx={{ ml: '8px' }} onClick={() => setBoardPlanningView()}
              className='Toolbar-create-list-button'
              color='secondary'
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faList} />}
            >
              <Typography>Planning View</Typography>
            </Button>
          </div>      :
          <Button sx={{ ml: '8px' }} onClick={() => setBoardWorkView()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='contained'
            startIcon={<FontAwesomeIcon icon={faList} />}
          >
            <Typography>Planning View</Typography>
          </Button>
        }
      </Toolbar>
    </div>
  )
}
