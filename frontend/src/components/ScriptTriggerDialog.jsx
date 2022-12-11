import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import PropTypes from 'prop-types'


const ScriptTriggerDialog = (props) => {
  const triggerActions = ['create', 'update', 'destroy'].sort()
  const triggerSubject = [ 'DB::User', 'DB::Workspace', 'DB::Board', 'DB::List', 'DB::Task', 'DB::Comment', 'DB::Tag', 'DB::Sprint', 'DB::UserWorkspace', 'DB::TaskUser', 'DB::TaskTag', 'DB::SprintTask' ].sort()
  const [newTrigger, setNewTrigger] = React.useState({
    subjectType: '',
    subjectId: '',
    action: '',
    delay: 0,
  })

  React.useEffect(() => {
    setNewTrigger({
      subjectType: '',
      subjectId: '',
      action: '',
      delay: 0,
    })
  }, [props])


  return (
    <Dialog open={props.openDial} onClose={props.handleCloseDial}>
      <form onSubmit={(event) => props.handleSubmit(event, newTrigger)}>
        <DialogTitle>Trigger creator</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexFlow: 'row', justifyContent: 'flex-end', gap: '8px' }}>
          <TextField
            required
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-action'
            value={newTrigger.action}
            label='Action'
            onChange={(event) => setNewTrigger({
              ...newTrigger,
              action: event.target.value,
            })
            }>
            { triggerActions.map((action, idx) => (
              <MenuItem value={action} key={`${action}-${idx}`}>
                {action}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-subject'
            value={newTrigger.subjectType}
            label='Subject Type'
            onChange={(event) => setNewTrigger({
              ...newTrigger,
              subjectType: event.target.value,
            })}>
            <MenuItem value=''>all</MenuItem>
            { triggerSubject.map((subject, idx) => (
              <MenuItem value={subject} key={`${subject}-${idx}`}>
                {subject}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={newTrigger.subjectId}
            onChange={(event) => setNewTrigger({
              ...newTrigger,
              subjectId: event.target.value,
            })}
            label='Subject id'
            variant='standard'
          />

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={newTrigger.delay}
            onChange={(event) => setNewTrigger({
              ...newTrigger,
              delay: event.target.value,
            })}
            label='Delay (seconds)'
            variant='standard'
          />
        </DialogContent>
        <DialogActions className=''>
          <Button onClick={props.handleCloseDial}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}


ScriptTriggerDialog.propTypes = {
  openDial: PropTypes.bool.isRequired,
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default ScriptTriggerDialog
