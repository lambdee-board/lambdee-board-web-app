import * as React from 'react'

import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Divider, List, ListItemButton, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material'
import useScriptRuns from '../../../api/script-runs'

import './ScriptRunsView.sass'

export default function ScriptRunsView() {
  const { data: scriptRuns, isLoading, isError } = useScriptRuns({})
  const [openDial, setOpenDial] = React.useState(false)
  const [currentRun, setCurrentRun] = React.useState({})


  const handleOpenDial = (scriptRun) => {
    setCurrentRun(scriptRun)
    setOpenDial(true)
  }
  const handleCloseDial = () => setOpenDial(false)


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
                    <Typography variant='h5'>{scriptRun.state}</Typography>
                  </ListItemButton>
                </div>
              ))}
        </List>
      </div>
      <Dialog
        open={openDial}
        onClose={handleCloseDial}
        fullWidth
        maxWidth='md'>
        <DialogTitle>{currentRun.name}</DialogTitle>
        <DialogContent sx={{ display: 'flex', gap: '8px' }}>
          <div className='Run-output'>
            {currentRun.output}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
