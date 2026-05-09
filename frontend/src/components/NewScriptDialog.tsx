import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

interface NewScript {
  name: string
  description: string
  content: string
  authorId?: number
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (event: React.FormEvent, newScript: NewScript) => void
}

const NewScriptDialog = ({ open, onClose, onSubmit }: Props) => {
  const [newScript, setNewScript] = React.useState<NewScript>({ name: '', description: '', content: '' })

  React.useEffect(() => {
    setNewScript({ name: '', description: '', content: '', authorId: parseInt(localStorage.getItem('id')!) })
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'>
      <form onSubmit={(event) => onSubmit(event, newScript)}>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default NewScriptDialog
