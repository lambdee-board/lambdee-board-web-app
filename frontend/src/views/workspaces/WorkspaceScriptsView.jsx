import * as React from 'react'

import {
  Typography,
  Toolbar,
  Button,
  Box
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faList, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import useCookie from 'react-use-cookie'

import './WorkspaceScriptsView.sass'
import NewScriptDialog from '../../components/NewScriptDialog'
import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'
import { mutateWorkspaceScripts } from '../../api/workspace-scripts'

export default function WorkspaceScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [openDial, setOpenDial] = React.useState(false)
  const [scriptView, setScriptView] = useCookie('showAllScripts', 'all')

  React.useEffect(() => {
    let navigatedOut = false
    if (navigatedOut) return

    if (scriptView === 'all') {
      navigate(`/workspaces/${workspaceId}/scripts/all`)
    } else {
      navigate(`/workspaces/${workspaceId}/scripts/runs`)
    }
    return () => { navigatedOut = true }
  }, [workspaceId, scriptView, navigate])

  const handleCloseDial = () => {
    setOpenDial(false)
  }

  const handleOpenDial = () => {
    setOpenDial(true)
  }

  const handleSubmit = (event, script) => {
    event.preventDefault()
    saveScript(script)
    handleCloseDial()
  }

  const saveScript = (payload) => {
    apiClient.post('/api/scripts', payload)
      .then((response) => {
        // successful request
        mutateWorkspaceScripts({})
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  return (
    <div className='WorkspaceScripts-wrapper'>
      <Toolbar className='WorkspaceScripts-toolbar'>
        <div>
          {scriptView === 'all' &&
            <Button
              onClick={handleOpenDial}
              className='WorkspaceScripts-newScript-btn'
              color='secondary'
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>Create new script</Typography>
            </Button>
          }
        </div>
        <div>
          <Button
            sx={{ ml: '8px' }}
            onClick={() => { if (scriptView !== 'all') setScriptView('all') }}
            className='WorkspaceScripts-scriptsAll-btn'
            color='secondary'
            variant={scriptView === 'all' ? 'contained' : 'outlined'}
            startIcon={<FontAwesomeIcon icon={faList} />}>
            <Typography>All scripts</Typography>
          </Button>
          <Button
            sx={{ ml: '8px' }}
            onClick={() => { if (scriptView !== 'runs') setScriptView('runs') }}
            className='WorkspaceScripts-scriptsRuns-btn'
            color='secondary'
            variant={scriptView === 'runs' ? 'contained' : 'outlined'}
            startIcon={<FontAwesomeIcon icon={faClockRotateLeft} />}>
            <Typography>Run history</Typography>
          </Button>
        </div>
      </Toolbar>
      <Box sx={{ height: '4px' }}></Box>
      <Outlet />
      <NewScriptDialog
        openDial={openDial}
        handleCloseDial={handleCloseDial}
        handleSubmit={handleSubmit} />
    </div>
  )
}
