import { Button, Menu, MenuItem, Modal, Box, Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptTriggers from '../api/scripts-triggers'
import apiClient from '../api/api-client'
import useAppAlertStore from '../stores/app-alert'
import CustomAlert from './CustomAlert'


import './ScriptButton.sass'


export default function ScriptButton({ variant, scope, id }) {
  const { data: scriptTriggers, isLoading, isError } = useScriptTriggers({ scope, id })
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const [scriptTriggerId, setScriptTriggerId] = React.useState()
  const [scriptTriggerText, setScriptTriggerText] = React.useState()
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const handleOpenScripts = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleRunScript = (triggerId) => {
    apiClient.post(`/api/ui_script_triggers/${triggerId}/executions`, { subjectId: id })
      .then((response) => {
        toggleAlertModalState()
        handleCloseScripts()
        addAlert({ severity: 'success', message: 'Action initialized!' })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  const handleCloseScripts = () => {
    setAnchorElUser(null)
  }
  if (isLoading || isError) return (<></>)
  if (scriptTriggers.length === 0) return (<></>)

  return (
    // <>
    //   {variant === 'icon' ?
    //     <>
    //       <IconButton color='secondary' onClick={handleOpenScripts}>
    //         <FontAwesomeIcon icon={faBolt} />
    //       </IconButton>
    //       <Menu
    //         id='scripts'
    //         anchorEl={anchorElUser}
    //         open={Boolean(anchorElUser)}
    //         onClose={handleCloseScripts}
    //       >
    //         {scriptTriggers?.map((scriptTrigger) => (
    //           <MenuItem
    //             onClick={() => {
    //               handleCloseScripts()
    //             }} key={scriptTrigger.scriptId}>
    //             {scriptTrigger.text}
    //           </MenuItem>
    //         ))}
    //       </Menu>
    //     </>        :
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
          <CustomAlert confirmAction={() => handleRunScript(scriptTriggerId)}
            dismissAction={() => {
              toggleAlertModalState()
              handleCloseScripts()
            }}
            title='Initialize Action?'
            message={`Are you sure you want to initialize action ${scriptTriggerText}?`}
            confirmMessage='Confirm, initialize action' />
        </Box>
      </Modal>
      <Button sx={{ ml: '6%' }}
        onClick={handleOpenScripts}
        className='ScriptButton'
        color='secondary'
        variant='outlined'
        startIcon={<FontAwesomeIcon icon={faBolt} />}>
              Actions
      </Button>
      <Menu
        id='scripts'
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseScripts}
      >
        {scriptTriggers?.map((scriptTrigger) => (
          <MenuItem
            onClick={() => {
              setScriptTriggerId(scriptTrigger.id)
              setScriptTriggerText(scriptTrigger.text)
              toggleAlertModalState()
            }}
            key={scriptTrigger.id}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }} >
              <Box sx={{ color: scriptTrigger.colour, mr: '8px' }}>
                <FontAwesomeIcon icon={faBolt} />
              </Box>
              <Typography>
                {scriptTrigger.text}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

ScriptButton.defaultProps = {
  variant: 'default'
}

ScriptButton.propTypes = {
  variant: PropTypes.string.isRequired,
  scope: PropTypes.string.isRequired,
  id: PropTypes.any.isRequired
}

