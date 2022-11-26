import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'


import { Card, Typography, Button } from '@mui/material'

import './Alert.sass'

export default function Alert({ action, title, message, confirmMessage, dismissMessage }) {
  return (

    <div>
      <div className='AlertModal-wrapper'>
        <Card className='AlertModal-card'>
          <Typography className='AlertModal-title' fontSize={24}>{title}?</Typography>
          <Typography className='AlertModal-message'>{message}</Typography>
          <div className='AlertModal-buttons'>
            <Button variant='contained' className='AlertModal-buttons-dismiss'>Dismiss</Button>
            <Button className='AlertModal-buttons-confirm'>Confirm, {title}</Button>
          </div>
        </Card>
      </div>
    </div>

  )
}

Alert.propTypes = {
  action: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  confirmMessage: PropTypes.string,
  dismissMessage: PropTypes.string
}
