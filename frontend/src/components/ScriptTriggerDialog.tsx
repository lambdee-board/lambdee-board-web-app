import * as React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import UiTriggerFrom from './trigger-form/UiTriggerFrom'
import CallbackTriggerFrom from './trigger-form/CallbackTriggerFrom'

interface Props {
  openDial: boolean
  handleCloseDial: () => void
  handleSubmit: (type: string, state: unknown) => void
}

const ScriptTriggerDialog = ({ openDial, handleCloseDial, handleSubmit }: Props) => {
  const [triggerType, setTriggerType] = React.useState('')

  return (
    <Dialog open={openDial} onClose={handleCloseDial}>
      <DialogTitle>Trigger creator</DialogTitle>
      <DialogContent sx={{ minHeight: '450px' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={triggerType === 'Callback' ? 'contained' : 'outlined'}
            color='info'
            sx={{ maxWidth: '150px', maxHeight: '75px', minWidth: '150px', minHeight: '75px' }}
            onClick={() => setTriggerType('Callback')}>
            Callback
          </Button>
          <Button
            variant={triggerType === 'UI' ? 'contained' : 'outlined'}
            color='success'
            sx={{ maxWidth: '150px', maxHeight: '75px', minWidth: '150px', minHeight: '75px' }}
            onClick={() => setTriggerType('UI')}>
          Action
          </Button>
          <Button
            disabled
            variant={triggerType === 'Schedule' ? 'contained' : 'outlined'}
            color='warning'
            sx={{ maxWidth: '150px', maxHeight: '75px', minWidth: '150px', minHeight: '75px' }}
            onClick={() => setTriggerType('Schedule')}>
            Schedule
          </Button>
        </Box>

        {triggerType === 'Callback' && <CallbackTriggerFrom handleCloseDial={handleCloseDial} handleSubmit={handleSubmit} />}
        {triggerType === 'UI' && <UiTriggerFrom handleCloseDial={handleCloseDial} handleSubmit={handleSubmit} />}
        {triggerType === 'Schedule' && <span>Schedule</span>}
      </DialogContent>
    </Dialog>
  )
}

export default ScriptTriggerDialog
