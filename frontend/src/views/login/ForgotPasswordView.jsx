import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  TextField,
  Typography,
  Link,
  Button
} from '@mui/material'

import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'
import { emailValid } from '../../utils/email-valid'

import './ForgotPasswordView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'

export default function ForgotPasswordView() {
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const emailInputRef = React.useRef()
  const [invalidEmail, setInvalidEmail] = React.useState(false)

  const handleResetPassword = () => {
    if (invalidEmail) return
    const email = emailInputRef.current.value

    const body = { email }
    apiClient.post('/api/users/send_reset_password', body)

    localStorage.clear()
    navigate('/login/password-reset')
  }

  const handleOnChange = (e) => {
    const email = e.target.value

    if (!emailValid(email)) return setInvalidEmail(true)

    setInvalidEmail(false)
  }

  return (
    <div className='forgotPasswordView-wrapper'>
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='forgotPasswordView-card'>
        <Typography className='forgotPasswordView-card-title' color='primary' variant='body1'>Lambdee</Typography>
        <TextField
          className='forgotPasswordView-card-input'
          label='Email'
          variant='outlined'
          inputRef={emailInputRef}
          error={invalidEmail}
          onChange={handleOnChange}
          helperText={invalidEmail ? 'Invalid email' : undefined}
        />
        <Link onClick={() => navigate('/login')} component='button' className='forgotPasswordView-card-reset' underline='none' variant='body2'>Back to login</Link>
        <Button
          onClick={handleResetPassword}
          className='forgotPasswordView-card-button'
          variant='contained'
          disabled={invalidEmail}
        >
          Reset Password
        </Button>
      </Card>
    </div>
  )
}


