import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Card,
  TextField,
  Typography,
  Link,
  Button,
  Skeleton
} from '@mui/material'

import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'
import useQuery from '../../utils/use-query'

import './ResetPasswordView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'
import useValidResetPassword from '../../api/valid-reset-password'

export default function ResetPasswordView() {
  const navigate = useNavigate()
  const query = useQuery()
  const resetPasswordToken = query.get('reset_password_token')
  const { isLoading, isError } = useValidResetPassword({ axiosOptions: { params: { resetPasswordToken } } })
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const passwordInputRef = React.useRef()
  const passwordConfirmationInputRef = React.useRef()
  const [differentPasswords, setDifferentPasswords] = React.useState(false)

  const validatePasswords = () => {
    const pass = passwordInputRef.current.value
    const passConf = passwordConfirmationInputRef.current.value

    if (pass === passConf) return setDifferentPasswords(false)

    setDifferentPasswords(true)
  }

  const handleResetPassword = () => {
    if (differentPasswords) return

    const password = passwordInputRef.current.value
    const passwordConfirmation = passwordConfirmationInputRef.current.value

    if (password === '' || password == null) return

    const body = {
      resetPasswordToken,
      password,
      passwordConfirmation
    }
    apiClient.post('/api/users/reset_password', body)
      .then(() => {
        localStorage.clear()
        navigate('/login?password_changed=true')
      })
      .catch(() => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (isLoading) return (
    <Skeleton variant='circular' width={40} height={40} />
  )

  if (isError) {
    return <Navigate to='/login' />
  }

  return (
    <div className='resetPasswordView-wrapper'>
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='resetPasswordView-card'>
        <Typography
          className='resetPasswordView-card-title'
          color='primary'
          variant='body1'
        >
          Lambdee
        </Typography>
        <TextField
          className='resetPasswordView-card-input'
          label='New Password'
          variant='outlined'
          type='password'
          inputRef={passwordInputRef}
          onChange={validatePasswords}
        />
        <TextField
          className='resetPasswordView-card-input'
          label='Confirm New Password'
          variant='outlined'
          type='password'
          inputRef={passwordConfirmationInputRef}
          onChange={validatePasswords}
          error={differentPasswords}
          helperText={differentPasswords ? 'Passwords are different' : undefined}
        />
        <Link
          onClick={() => navigate('/login')}
          component='button'
          className='resetPasswordView-card-reset'
          underline='none'
          variant='body2'
        >
          Back to login
        </Link>
        <Button
          onClick={handleResetPassword}
          className='resetPasswordView-card-button'
          variant='contained'
          disabled={differentPasswords}
        >
          Reset Password
        </Button>
      </Card>
    </div>
  )
}


