import React from 'react'

import {
  Typography,
  MenuItem,
  Skeleton,
  Divider
} from '@mui/material'

import DropdownButton from '../DropdownButton'
import useScriptTriggers from '../../api/scripts-triggers'
import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'

const ScriptMenuButton = () => {
  const { data: scriptTriggers, isLoading, isError } = useScriptTriggers({ scope: 'users', id: 'current' })
  const [anchorEl, setAnchorEl] = React.useState(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)


  const handleClose = () => setAnchorEl(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleRun = (triggerId) => {
    apiClient.post(`/api/ui_script_triggers/${triggerId}/executions`)
      .then((response) => {
        handleClose()
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
    <DropdownButton label='Actions' anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose}>
      {scriptTriggers?.map((scriptTrigger) => (
        <MenuItem className='Workspace-menu-item'
          onClick={() => {
            handleRun(scriptTrigger.id)
          }} key={scriptTrigger.scriptId}>
          {scriptTrigger.scriptId}
        </MenuItem>
      ))}
    </DropdownButton>
  )
}

export default ScriptMenuButton
