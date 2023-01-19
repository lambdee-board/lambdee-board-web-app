import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import PropTypes from 'prop-types'


const NewScriptVariableDialog = (props) => {
  const [newVariable, setNewVariable] = React.useState({ name: '', description: '', content: '' })

  React.useEffect(() => {
    setNewVariable({
      name: '',
      description: '',
      value: ''
    })
  }, [props])


  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth='sm'>
      <form onSubmit={(event) => props.onSubmit(event, newVariable)}>
        <DialogTitle>New script</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TextField
            fullWidth
            required
            autoFocus
            margin='dense'
            autoComplete='off'
            value={newVariable.name}
            onChange={(event) => setNewVariable({ ...newVariable, name: event.target.value })}
            label='Name'
            variant='standard' />
          <TextField
            fullWidth
            margin='dense'
            autoComplete='off'
            value={newVariable.description}
            onChange={(event) => setNewVariable({ ...newVariable, description: event.target.value })}
            label='Description'
            variant='standard'
            multiline />
          <TextField
            fullWidth
            margin='dense'
            autoComplete='off'
            value={newVariable.value}
            onChange={(event) => setNewVariable({ ...newVariable, value: event.target.value })}
            label='Value'
            variant='standard'
            multiline />
        </DialogContent>
        <DialogActions className=''>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}


NewScriptVariableDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default NewScriptVariableDialog
