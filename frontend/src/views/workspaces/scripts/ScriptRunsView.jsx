import * as React from 'react'

import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Divider, List, ListItemButton, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material'
import useScriptRuns from '../../../api/script-runs'

import './ScriptRunsView.sass'
import CodeHighlighter from '../../../components/CodeHighlighter'

export default function ScriptRunsView() {
  const { data: scriptRuns, isLoading, isError } = useScriptRuns({})
  const [openDial, setOpenDial] = React.useState(false)
  const [currentRun, setCurrentRun] = React.useState(null)


  const handleOpenDial = (scriptRun) => {
    console.log(currentRun)
    setCurrentRun(scriptRun)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setOpenDial(false)
    setCurrentRun(null)
  }


  return (
    <div className='WorkspaceScriptsRuns'>
      <div className='list-wrapper'>
        <List className='List'>
          <Divider />
          { !(isLoading || isError) &&
              scriptRuns.map((scriptRun, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => handleOpenDial(scriptRun)}
                    sx={{ fontSize: '32px', gap: '16px' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    <Typography variant='h5'>{scriptRun.scriptName}</Typography>
                    <Typography variant='h5'>{scriptRun.state}</Typography>
                  </ListItemButton>
                </div>
              ))}
        </List>
      </div>
      { currentRun &&
        <Dialog
          open={openDial}
          onClose={handleCloseDial}
          fullWidth
          maxWidth='md'>
          <DialogTitle>{currentRun.scriptName}</DialogTitle>
          <DialogContent sx={{ display: 'flex', gap: '8px' }}>
            <div className='Run-output'>
              {<CodeHighlighter className='-outputLine' code={currentRun.input} />}
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}
