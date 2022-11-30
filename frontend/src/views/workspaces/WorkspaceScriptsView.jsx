import * as React from 'react'

import {
  Typography,
  Toolbar,
  Button,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faList } from '@fortawesome/free-solid-svg-icons'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import useCookie from 'react-use-cookie'

import './WorkspaceScriptsView.sass'

export default function WorkspaceScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()

  const [scriptView, setScriptView] = useCookie('showAllScripts', 'all')

  React.useEffect(() => {
    if (scriptView === 'all') {
      navigate(`/workspaces/${workspaceId}/scripts/all`)
    } else {
      navigate(`/workspaces/${workspaceId}/scripts/runs`)
    }
  }, [workspaceId, scriptView])


  return (
    <div className='WorkspaceScripts-wrapper'>
      <Toolbar className='WorkspaceScripts-toolbar'>
        <Button sx={{ ml: '8px' }}
          onClick={() => {
            if (scriptView === 'all') return
            setScriptView('all')
          }}
          className='WorkspaceScripts-scriptsAll-btn'
          color='secondary'
          variant={scriptView === 'all' ? 'contained' : 'outlined'}
          startIcon={<FontAwesomeIcon icon={faList} />}>
          <Typography>All scripts</Typography>
        </Button>
        <Button sx={{ ml: '8px' }}
          onClick={() => {
            if (scriptView === 'runs') return
            setScriptView('runs')
          }}
          className='WorkspaceScripts-scriptsRuns-btn'
          color='secondary'
          variant={scriptView === 'runs' ? 'contained' : 'outlined'}
          startIcon={<FontAwesomeIcon icon={faClockRotateLeft} />} >
          <Typography>Run history</Typography>
        </Button>
      </Toolbar>
      <Outlet />
    </div>
  )
}
