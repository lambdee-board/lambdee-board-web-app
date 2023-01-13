import React from 'react'

import {
  Typography,
  MenuItem,
  Skeleton,
  Divider,
  Modal,
  Box
} from '@mui/material'

import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropdownButton from '../DropdownButton'
import useScriptTriggers from '../../api/scripts-triggers'
import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'
import CustomAlert from '../CustomAlert'

const ScriptMenuButton = () => {
  const { data: scriptTriggers, isLoading, isError } = useScriptTriggers({ scope: 'users', id: 'current' })
  const [anchorEl, setAnchorEl] = React.useState(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const [scriptTriggerId, setScriptTriggerId] = React.useState()
  const [scriptTriggerText, setScriptTriggerText] = React.useState()
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const handleClose = () => setAnchorEl(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleRun = (triggerId) => {
    apiClient.post(`/api/ui_script_triggers/${triggerId}/executions`)
      .then((response) => {
        toggleAlertModalState()
        handleClose()
        addAlert({ severity: 'success', message: 'Action initialized!' })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (isLoading || isError) return (
    <DropdownButton label='Actions'>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
      <MenuItem>
        <Skeleton variant='rectangular' width={24} height={24} />
        <Skeleton variant='text' width={50} sx={{ ml: 2 }} />
      </MenuItem>
      <Divider />
      <MenuItem>
        <Typography color='primary'>More...</Typography>
      </MenuItem>
    </DropdownButton>
  )

  if (scriptTriggers.length === 0) return (<></>)

  return (
    <>
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
          <CustomAlert confirmAction={() => handleRun(scriptTriggerId)}
            dismissAction={() => {
              toggleAlertModalState()
              handleClose()
            }}
            title='Initialize Action?'
            message={`Are you sure you want to initialize action ${scriptTriggerText}?`}
            confirmMessage='Confirm, initialize action' />
        </Box>
      </Modal>
      <DropdownButton label='Actions' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
        {scriptTriggers?.map((scriptTrigger) => (
          <MenuItem
            onClick={() => {
              setScriptTriggerId(scriptTrigger.id)
              setScriptTriggerText(scriptTrigger.text)
              toggleAlertModalState()
            }}
            key={scriptTrigger.id}
          >
            <Box sx={{ color: scriptTrigger.colour, display: 'flex', flexDirection: 'row' }} >
              <Box sx={{ mr: '8px' }}>
                <FontAwesomeIcon icon={faBolt} />
              </Box>
              <Typography>
                {scriptTrigger.text}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </DropdownButton>
    </>
  )
}

export default ScriptMenuButton
