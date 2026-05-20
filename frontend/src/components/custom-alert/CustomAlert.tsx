import React from 'react'

import { Card, Typography, Button } from '@mui/material'

import './CustomAlert.sass'

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
      <div className='AlertModal-wrapper'>
        <Card className='AlertModal-card'>
          <Typography className='AlertModal-title' sx={{
            fontSize: 24
          }}>{title ? title : 'Are you sure?'}</Typography>
          <Typography className='AlertModal-message'>{message}</Typography>
          <div className='AlertModal-buttons'>
            <Button onClick={dismissAction} variant='contained' className='AlertModal-buttons-dismiss'>{dismissMessage ? dismissMessage : 'Dismiss'}</Button>
            <Button onClick={confirmAction} className='AlertModal-buttons-confirm'>{confirmMessage ? confirmMessage : 'Confirm'}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
