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
        <Card sx={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)', padding: 4 }}>
          <Typography sx={{ fontSize: 24, display: 'flex', justifyContent: 'center', mb: 4 }}>{title ? title : 'Are you sure?'}</Typography>
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
