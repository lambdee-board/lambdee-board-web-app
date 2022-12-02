import React from 'react'
import { useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode'
import {
  Card,
  Link,
  TextField,
  Typography,
  Button,
  Alert
} from '@mui/material'

import apiClient from '../../api/api-client'
import useAppAlertStore from '../../stores/app-alert'

import './LoginView.sass'
import lambdeeLogo from '../../assets/lambdee-logo.svg'

export default function LoginView() {
  const emailRef = React.useRef()
  const passwordRef = React.useRef()
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [loginFail, setLoginFail] = React.useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  const login = () => {
    const emailInput = emailRef.current.value
    const passwordInput = passwordRef.current.value
    const credentials = {
      user: { email: emailInput, password: passwordInput }

    }

    apiClient.post('/api/users/sign_in', credentials)
      .then((response) => {
        localStorage.setItem('token', response.headers.authorization)
        const role = jwt(response.headers.authorization.replace('Bearer ', '')).role
        localStorage.setItem('role', role)
        navigate('/')
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
        setLoginFail(true)
      })
  }

  return (
    <div className='loginView-wrapper' onKeyDown={handleKeyDown} >
      <img
        className='logo'
        src={lambdeeLogo}
      />
      <Card className='loginView-card'>
        <Typography className='loginView-card-title' color='primary' variant='body1'>Lambdee</Typography>
        <TextField inputRef={emailRef} className='loginView-card-input' label='Email' variant='outlined' />
        <TextField inputRef={passwordRef} type='password' className='loginView-card-input' label='Password' variant='outlined' />
        {loginFail &&
          <Alert severity='error' className='loginView-card-input' sx={{ width: '73%' }}>Incorrect credentials!</Alert>
        }
        <Link
          onClick={() => navigate('/login/forgot-password')}
          component='button'
          className='loginView-card-reset'
          underline='none'
          variant='body2'>Forgot password?</Link>
        <Button onClick={() => login()} className='loginView-card-button' variant='contained'>Login</Button>
      </Card>
    </div>
  )
}


