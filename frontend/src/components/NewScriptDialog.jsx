import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import PropTypes from 'prop-types'


const NewScriptDialog = (props) => {
  const [newScript, setNewScript] = React.useState({ name: '', description: '', content: '' })

  React.useEffect(() => {
    setNewScript({ name: '', description: '', content: '', authorId: parseInt(localStorage.getItem('id')) })
  }, [props])


  return (
    <Dialog
      open={props.openDial}
      onClose={props.handleCloseDial}
      fullWidth
      maxWidth='sm'>
      <form onSubmit={(event) => props.handleSubmit(event, newScript)}>
        <DialogTitle>New script</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TextField
            fullWidth
            required
            autoFocus
            margin='dense'
            autoComplete='off'
            value={newScript.name}
            onChange={(event) => setNewScript({ ...newScript, name: event.target.value })}
            label='Name'
            variant='standard' />
          <TextField
            fullWidth
            margin='dense'
            autoComplete='off'
            value={newScript.description}
            onChange={(event) => setNewScript({ ...newScript, description: event.target.value })}
            label='Description'
            variant='standard'
            multiline />
        </DialogContent>
        <DialogActions className=''>
          <Button onClick={props.handleCloseDial}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}


NewScriptDialog.propTypes = {
  openDial: PropTypes.bool.isRequired,
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default NewScriptDialog
