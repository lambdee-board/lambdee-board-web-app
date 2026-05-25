import React from 'react'

import { Box, Card, Typography, Button } from '@mui/material'


interface Props {
  confirmAction: () => void
  dismissAction?: () => void
  message: string
  title?: string
  confirmMessage?: string
  dismissMessage?: string
}

export default function CustomAlert({ confirmAction, dismissAction, title, message, confirmMessage, dismissMessage }: Props) {
  return (
    <div>
      <Box sx={{ width: '560px' }}>
        <Card sx={{ bgcolor: 'primary.light', padding: 4 }}>
          <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>{title ? title : 'Are you sure?'}</Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>{message}</Typography>
          <Box sx={{ display: 'flex', flex: 1 }}>
            <Button onClick={dismissAction} variant='contained' sx={{ flex: 1 }}>{dismissMessage ? dismissMessage : 'Dismiss'}</Button>
            <Button onClick={confirmAction} sx={{ flex: 1, color: '#FF0000' }}>{confirmMessage ? confirmMessage : 'Confirm'}</Button>
          </Box>
        </Card>
      </Box>
    </div>
  )
}
