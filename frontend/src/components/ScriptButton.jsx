import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptTriggers from '../api/scripts-triggers'
import apiClient from '../api/api-client'
import useAppAlertStore from '../stores/app-alert'


import './ScriptButton.sass'


export default function ScriptButton({ variant, scope, id }) {
  const { data: scriptTriggers, isLoading, isError } = useScriptTriggers({ scope, id })
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenScripts = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleRunScript = (triggerId) => {
    apiClient.post(`/api/ui_script_triggers/${triggerId}/executions`, { subjectId: id })
      .then((response) => {
        handleCloseScripts()
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
    <>
      {variant === 'icon' ?       <>
        <IconButton color='secondary' onClick={handleOpenScripts}>
          <FontAwesomeIcon icon={faBolt} />
        </IconButton>
        <Menu
          id='scripts'
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseScripts}
        >
          {scriptTriggers?.map((scriptTrigger) => (
            <MenuItem
              onClick={() => {
                handleCloseScripts()
              }} key={scriptTrigger.scriptId}>
              {scriptTrigger.text}
            </MenuItem>
          ))}
        </Menu>
      </> :  <> <Button sx={{ ml: '6%' }}
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
              handleRunScript(scriptTrigger.id)
            }} key={scriptTrigger.id}>
            {scriptTrigger.text}
          </MenuItem>
        ))}
      </Menu>
      </>}
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

