import * as React from 'react'
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import PropTypes from 'prop-types'
import UiTriggerFrom from './trigger-form/UiTriggerFrom'
import CallbackTriggerFrom from './trigger-form/CallbackTriggerFrom'

const ScriptTriggerDialog = (props) => {
  const [triggerType, setTriggerType] = React.useState('')

  return (
    <Dialog open={props.openDial} onClose={props.handleCloseDial}>
      <DialogTitle>Trigger creator</DialogTitle>
      <DialogContent sx={{ height: '440px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
        </div>

        {triggerType === 'Callback' && <CallbackTriggerFrom handleCloseDial={props.handleCloseDial} handleSubmit={props.handleSubmit} />}
        {triggerType === 'UI' && <UiTriggerFrom handleCloseDial={props.handleCloseDial} handleSubmit={props.handleSubmit} />}
        {triggerType === 'Schedule' && <span>Schedule</span>}
      </DialogContent>
    </Dialog>
  )
}


ScriptTriggerDialog.propTypes = {
  openDial: PropTypes.bool.isRequired,
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default ScriptTriggerDialog
