import * as React from 'react'

import {
  Typography,
  Toolbar,
  Button,
  Box
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faList, faPlus, faKey } from '@fortawesome/free-solid-svg-icons'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import useCookie from 'react-use-cookie'

import './WorkspaceScriptsView.sass'

import NewScriptDialog from '../../components/NewScriptDialog'
import NewScriptVariableDialog from '../../components/NewScriptVariableDialog'
import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'
import useScriptVariablesPage from '../../stores/script-variables-page'
import { mutateWorkspaceScripts } from '../../api/workspace-scripts'
import { mutateScriptVariables } from '../../api/script-variables'
import useScriptsPage from '../../stores/scripts-page'

export default function WorkspaceScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)

  const scriptVariablesPer = useScriptVariablesPage((store) => store.per)
  const scriptVariablesPage = useScriptVariablesPage((store) => store.page)

  const scriptsPer = useScriptsPage((store) => store.per)
  const scriptsPage = useScriptsPage((store) => store.page)

  const [scriptView, setScriptView] = useCookie('showAllScripts', 'all')
  const [newScriptIsOpen, setNewScriptIsOpen] = React.useState(false)
  const [newScriptVariableIsOpen, setNewScriptVariableIsOpen] = React.useState(false)

  React.useEffect(() => {
    let navigatedOut = false
    if (navigatedOut) return

    const scriptSubpath = scriptView ?? 'runs'
    const expectedPath = `/workspaces/${workspaceId}/scripts/${scriptSubpath}`
    navigate(expectedPath)

    return () => { navigatedOut = true }
  }, [workspaceId, scriptView, navigate])

  const closeNewScript = () => {
    setNewScriptIsOpen(false)
  }

  const openNewScript = () => {
    setNewScriptIsOpen(true)
  }

  const persistNewScript = (event, script) => {
    event.preventDefault()
    saveScript(script)
    closeNewScript()
  }

  const saveScript = (payload) => {
    apiClient.post('/api/scripts', payload)
      .then((response) => {
        // successful request
        addAlert({ severity: 'success', message: `Added ${payload.name}` })
        mutateWorkspaceScripts({ axiosOptions: { params: { per: scriptsPer, page: scriptsPage } } })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const closeNewScriptVariable = () => {
    setNewScriptVariableIsOpen(false)
  }

  const openNewScriptVariable = () => {
    setNewScriptVariableIsOpen(true)
  }

  const persistNewScriptVariable = (event, scriptVariable) => {
    event.preventDefault()
    saveScriptVariable(scriptVariable)
    closeNewScriptVariable()
  }

  const saveScriptVariable = (payload) => {
    apiClient.post('/api/script_variables', payload)
      .then((response) => {
        // successful request

        addAlert({ severity: 'success', message: `Added ${payload.name}` })
        mutateScriptVariables({ axiosOptions: { params: { per: scriptVariablesPer, page: scriptVariablesPage } } })
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
              onClick={openNewScript}
              className='WorkspaceScripts-newScript-btn'
              color='secondary'
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New script</Typography>
            </Button>
          }
          {scriptView === 'variables' &&
            <Button
              onClick={openNewScriptVariable}
              className='WorkspaceScripts-newScript-btn'
              color='secondary'
              variant='outlined'
              startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New variable</Typography>
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
          <Button
            sx={{ ml: '8px' }}
            onClick={() => { if (scriptView !== 'variables') setScriptView('variables') }}
            className='WorkspaceScripts-scriptsRuns-btn'
            color='secondary'
            variant={scriptView === 'variables' ? 'contained' : 'outlined'}
            startIcon={<FontAwesomeIcon icon={faKey} />}>
            <Typography>Variables</Typography>
          </Button>
        </div>
      </Toolbar>
      <div className='WorkspaceScripts'>
        <Box sx={{ height: '4px' }}></Box>
        <Outlet />
        <NewScriptDialog
          open={newScriptIsOpen}
          onClose={closeNewScript}
          onSubmit={persistNewScript}
        />
        <NewScriptVariableDialog
          open={newScriptVariableIsOpen}
          onClose={closeNewScriptVariable}
          onSubmit={persistNewScriptVariable}
        />
      </div>
    </div>
  )
}
