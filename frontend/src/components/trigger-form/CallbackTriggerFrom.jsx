import * as React from 'react'
import { Button, MenuItem, TextField } from '@mui/material'
import PropTypes from 'prop-types'


const CallbackTriggerFrom = (props) => {
  const triggerActions = ['create', 'destroy', 'update']
  const triggerSubject = [
    'DB::Board',
    'DB::Comment',
    'DB::List',
    'DB::Sprint',
    'DB::SprintTask',
    'DB::Tag',
    'DB::Task',
    'DB::TaskTag',
    'DB::TaskUser',
    'DB::User',
    'DB::UserWorkspace',
    'DB::Workspace'
  ]
  const [newTrigger, setNewTrigger] = React.useState({
    subjectType: '',
    subjectId: '',
    action: '',
    delay: 0,
  })

  return (
    <div>
      <div style={{ display: 'flex', flexFlow: 'column', alignContent: 'center', gap: '8px' }}>
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
      </div>
      <div>
        <Button size='large' onClick={props.handleCloseDial}>Cancel</Button>
        <Button size='large' onClick={() => props.handleSubmit('callback', newTrigger)}>Create</Button>
      </div>
    </div>
  )
}


CallbackTriggerFrom.propTypes = {
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default CallbackTriggerFrom
