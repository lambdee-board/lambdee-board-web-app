import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  TextField,
  Typography,
  Link,
  Button
} from '@mui/material'

import './ForgotPasswordView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'

export default function ForgotPasswordView() {
  const navigate = useNavigate()
  return (
    <div className='forgotPasswordView-wrapper'>
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='forgotPasswordView-card'>
        <Typography className='forgotPasswordView-card-title' color='primary' variant='body1'>Lambdee</Typography>
        <TextField className='forgotPasswordView-card-input' label='Email' variant='outlined' />
        <Link onClick={() => navigate('/login')} component='button' className='forgotPasswordView-card-reset' underline='none' variant='body2'>Back to login</Link>
        <Button onClick={() => navigate('/login/reset-password')} className='forgotPasswordView-card-button' variant='contained'>Reset Password</Button>
      </Card>
    </div>
  )
}

