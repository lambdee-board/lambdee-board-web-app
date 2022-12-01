import * as React from 'react'

import { Divider, List, ListItemButton, Typography, Dialog, Chip } from '@mui/material'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptRuns from '../../../api/script-runs'
import CodeHighlighter from '../../../components/CodeHighlighter'

import './ScriptRunsView.sass'

export default function ScriptRunsView() {
  const { data: scriptRuns, isLoading, isError } = useScriptRuns({})
  const [openDial, setOpenDial] = React.useState(false)
  const [currentRun, setCurrentRun] = React.useState(null)

  const stateColors = {
    'running': '#03a9f4',
    'executed': '#4caf50',
    'failed': '#ff1744',
    'timed_out': '#ff9800',
    'connection_failed': '#af52bf'
  }


  const handleOpenDial = (scriptRun) => {
    console.log(scriptRun)
    setCurrentRun(scriptRun)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setOpenDial(false)
    setCurrentRun(null)
  }

  if ((isLoading || isError)) return

  return (
    <div className='WorkspaceScriptsRuns'>
      <div className='list-wrapper'>
        <List className='List'>
          <Divider />
          {scriptRuns.length > 0 ?
            scriptRuns.map((scriptRun, idx) => (
              <div key={idx}>
                <ListItemButton
                  divider
                  onClick={() => handleOpenDial(scriptRun)}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', fontSize: '32px', gap: '16px' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} color={stateColors[scriptRun.state]} />
                    <Typography variant='h5'>{scriptRun.scriptName}</Typography>
                  </div>
                  <Chip label={scriptRun.state} sx={{ bgcolor: stateColors[scriptRun.state], color: 'white' }} />
                </ListItemButton>
              </div>
            )) :
            <Typography className='no-script-runs'>No script was run yet</Typography>
          }
        </List>

      </div>
      { currentRun &&
        <Dialog
          open={openDial}
          onClose={handleCloseDial}
          fullWidth
          maxWidth='lg'>
          <div className='dialog-wrapper' style={{ padding: '24px' }}>
            <div className='dialog-header'>
              <Typography variant='h4'>{currentRun.scriptName}</Typography>
              <Typography sx={{ color: stateColors[currentRun.state] }} variant='h5'>
                {currentRun.state}
              </Typography>
            </div>
            <div className='dialog-content'>
              <div className='dialog-output'>
                <CodeHighlighter
                  className='dialog-output-line'
                  code={currentRun.input} />
              </div>
              <div className='dialog-output'>
                <CodeHighlighter
                  className='dialog-output-line'
                  code={currentRun.output || 'No output'}
                  plain={true}
                />
              </div>
            </div>
          </div>
        </Dialog>
      }
    </div>
  )
}
