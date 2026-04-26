import PropTypes from 'prop-types'
import React from 'react'


import { Card, Typography, Button } from '@mui/material'

import './CustomAlert.sass'

export default function CustomAlert({ confirmAction, dismissAction, title, message, confirmMessage, dismissMessage }) {
  return (

    <div>
      <div className='AlertModal-wrapper'>
        <Card className='AlertModal-card'>
          <Typography className='AlertModal-title' fontSize={24}>{title ? title : 'Are you sure?'}</Typography>
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

CustomAlert.propTypes = {
  confirmAction: PropTypes.func.isRequired,
  dismissAction: PropTypes.func,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  confirmMessage: PropTypes.string,
  dismissMessage: PropTypes.string
}
