import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  TextField,
  Typography,
  Link,
  Button
} from '@mui/material'

import apiClient from '../../../api/axios-client'
import { emailValid } from '../../../utils/email-valid'


import lambdeeLogo from '../../../assets/lambdee-logo.svg'

export default function ForgotPasswordView() {
  const navigate = useNavigate()
  const emailInputRef = React.useRef<HTMLInputElement>(null)
  const [invalidEmail, setInvalidEmail] = React.useState(false)

  const handleResetPassword = () => {
    if (invalidEmail) return
    const email = emailInputRef.current!.value

    const body = { email }
    apiClient.post('/api/users/send_reset_password', body)

    localStorage.clear()
    navigate('/login/password-reset')
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value

    if (!emailValid(email)) return setInvalidEmail(true)

    setInvalidEmail(false)
  }

  return (
    <div style={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
      <img
        style={{ display: 'flex', width: '64px', height: '64px' }}
        src={lambdeeLogo}
      />
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, py: 3, px: 1, width: '248px' }}>
        <Typography sx={{ fontSize: '24px', mb: 3 }} color='primary' variant='body1'>Lambdee</Typography>
        <TextField
          sx={{ mb: 2 }}
          label='Email'
          variant='outlined'
          inputRef={emailInputRef}
          error={invalidEmail}
          onChange={handleOnChange}
          helperText={invalidEmail ? 'Invalid email' : undefined}
        />
        <Link onClick={() => navigate('/login')} component='button' sx={{ display: 'flex', alignSelf: 'flex-start', ml: '9%', mb: '6%' }} underline='none' variant='body2'>Back to login</Link>
        <Button
          onClick={handleResetPassword}
          sx={{ width: '192px' }}
          variant='contained'
          disabled={invalidEmail}
        >
          Reset Password
        </Button>
      </Card>
    </div>
  )
}
