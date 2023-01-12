import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Link,
} from '@mui/material'
import {
  faEnvelopeOpenText
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import './PasswordResetView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'


export default function PasswordResetView() {
  const navigate = useNavigate()
  return (
    <div className='passwordResetView-wrapper'>
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='passwordResetView-card'>
        <Typography className='passwordResetView-card-title' color='primary' variant='body1'>Lambdee</Typography>
        <Typography sx={{ fontSize: '14px' }} variant='caption'>Reset instructions have been sent!</Typography>
        <FontAwesomeIcon className='passwordResetView-card-icon' icon={faEnvelopeOpenText} />
        <Link onClick={() => navigate('/login')} component='button' className='passwordResetView-card-reset' underline='none' variant='body2'>Back to login</Link>

      </Card>
    </div>
  )
}


