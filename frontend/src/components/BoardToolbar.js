import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useCookie from 'react-use-cookie'

import { faPlus, faXmark, faList, faPersonRunning, faChartLine, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Toolbar, Button, Typography, IconButton, ClickAwayListener, OutlinedInput, Modal, Box } from '@mui/material'

import apiClient from '../api/api-client'
import { mutateBoard } from '../api/board'
import useAppAlertStore from '../stores/app-alert'
import { useBoardActiveSprint, mutateBoardActiveSprint } from '../api/board-active-sprint'

import { ManagerContent } from '../permissions/content'
import SprintModal from './SprintModal.js'

import './BoardToolbar.sass'

export default function BoardToolbar(props) {
  const navigate = useNavigate()
  const { boardId, workspaceId } = useParams()
  const { data: activeSprint } = useBoardActiveSprint({ id: boardId })
  const [newListButtonVisible, setNewListButtonVisible] = React.useState(true)
  const [newSprintModal, setNewSprintModal] = React.useState(false)
  const [boardView, setBoardView] = useCookie('1')
  const newListInputRef = React.useRef()
  const addAlert = useAppAlertStore((store) => store.addAlert)

  const handleCloseSprintModal = () => {
    setNewSprintModal(false)
  }

  const setBoardWorkView = () => {
    setBoardView('0')
  }
  const setBoardPlanningView = () => {
    setBoardView('1')
  }
  const setBoardReportsView = () => {
    setBoardView('2')
  }

  useEffect(() => {
    if (boardView === '2') {
      { navigate(`/workspaces/${workspaceId}/boards/${boardId}/reports`) }
    } else if (boardView === '1') {
      { navigate(`/workspaces/${workspaceId}/boards/${boardId}/planning`) }
    } else {
      { navigate(`/workspaces/${workspaceId}/boards/${boardId}/work`) }
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
        addAlert({ severity: 'success', message: 'New List Created!' })
        setNewListButtonVisible(true)
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
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
          <SprintModal activeSprint={activeSprint} closeModal={handleCloseSprintModal} mutate={mutateBoardActiveSprint} />
        </Box>
      </Modal>
      <Toolbar className='Toolbar'>
        {boardView === '1' &&
      <>
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
        {!activeSprint ?

          <ManagerContent>
            <Button sx={{ ml: '8px' }} onClick={() => setNewSprintModal(true)}
              className='Toolbar-create-spring-button'
              color='secondary'
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faPersonRunning} />}
            >
              <Typography>Start Sprint</Typography>
            </Button>
          </ManagerContent>       :
          <Button sx={{ ml: '8px' }} onClick={() => setNewSprintModal(true)}
            className='Toolbar-create-spring-button'
            color='secondary'
            variant='contained'
            startIcon={<FontAwesomeIcon icon={faPersonRunning} />}
          >
            <Typography>View Sprint</Typography>
          </Button>}

      </>

        }

      </Toolbar>
      <Toolbar className='Toolbar'>
        {boardView === '0' ?
          <div>
            <Button sx={{ ml: '8px' }}
              className='Toolbar-create-list-button'
              color='secondary'
              variant='contained'
              startIcon={<FontAwesomeIcon icon={faBriefcase} />}
            >
              <Typography>Work View</Typography>
            </Button>
          </div>      :
          <Button sx={{ ml: '8px' }} onClick={() => setBoardWorkView()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <Typography>Work View</Typography>
          </Button>
        }
        {boardView === '1' ?
          <div>
            <Button sx={{ ml: '8px' }}
              className='Toolbar-create-list-button'
              color='secondary'
              variant='contained'
              startIcon={<FontAwesomeIcon icon={faList} />}
            >
              <Typography>Planning View</Typography>
            </Button>
          </div>      :
          <Button sx={{ ml: '8px' }} onClick={() => setBoardPlanningView()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faList} />}
          >
            <Typography>Planning View</Typography>
          </Button>
        }
        {boardView === '2' ?
          <div>
            <Button sx={{ ml: '8px' }}
              className='Toolbar-create-list-button'
              color='secondary'
              variant='contained'
              startIcon={<FontAwesomeIcon icon={faChartLine} />}
            >
              <Typography>Report View</Typography>
            </Button>
          </div>      :
          <Button sx={{ ml: '8px' }} onClick={() => setBoardReportsView()}
            className='Toolbar-create-list-button'
            color='secondary'
            variant='outlined'
            startIcon={<FontAwesomeIcon icon={faChartLine} />}
          >
            <Typography>Report View</Typography>
          </Button>
        }
      </Toolbar>
    </div>
  )
}
