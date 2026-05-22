import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

interface NewVariable {
  name: string
  description: string
  value: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (event: React.FormEvent, newVariable: NewVariable) => void
}

const NewScriptVariableDialog = ({ open, onClose, onSubmit }: Props) => {
  const [newVariable, setNewVariable] = React.useState<NewVariable>({ name: '', description: '', value: '' })

  React.useEffect(() => {
    setNewVariable({
      name: '',
      description: '',
      value: ''
    })
  }, [open])


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'>
      <form onSubmit={(event) => onSubmit(event, newVariable)}>
        <DialogTitle>New script</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NewScriptVariableDialog
