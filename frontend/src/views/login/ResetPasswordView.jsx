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


import './ResetPasswordView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'


export default function ResetPasswordView() {
  const navigate = useNavigate()
  return (
    <div className='resetPasswordView-wrapper'>
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='resetPasswordView-card'>
        <Typography className='resetPasswordView-card-title' color='primary' variant='body1'>Lambdee</Typography>
        <Typography sx={{ fontSize: '14px' }} variant='caption'>Reset instructions have been sent!</Typography>
        <FontAwesomeIcon className='resetPasswordView-card-icon' icon={faEnvelopeOpenText} />
        <Link onClick={() => navigate('/login')} component='button' className='resetPasswordView-card-reset' underline='none' variant='body2'>Back to login</Link>

      </Card>
    </div>
  )
}

