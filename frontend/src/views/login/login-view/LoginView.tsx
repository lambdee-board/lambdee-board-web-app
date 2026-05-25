import React from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import {
  Box,
  Card,
  Link,
  TextField,
  Typography,
  Button,
  Alert
} from '@mui/material'

import apiClient from '../../../api/axios-client'
import useAppAlertStore from '../../../stores/app-alert'
import { emailValid } from '../../../utils/email-valid'
import useQuery from '../../../utils/use-query'


import lambdeeLogo from '../../../assets/lambdee-logo.svg'

export default function LoginView() {
  const query = useQuery()
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const [passwordChanged, setPasswordChanged] = React.useState(Boolean(query.get('password_changed')))
  const navigate = useNavigate()
  const addAlertTimeout = useAppAlertStore((store) => store.addAlertTimeout)
  const [loginFail, setLoginFail] = React.useState(false)
  const [invalidEmail, setInvalidEmail] = React.useState(false)

  const verifyEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    if (!emailValid(email)) return setInvalidEmail(true)

    setInvalidEmail(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  const login = (email?: string, password?: string) => {
    const emailInput = email ?? emailRef.current!.value
    const passwordInput = password ?? passwordRef.current!.value
    const credentials = {
      user: { email: emailInput, password: passwordInput }
    }

    apiClient.post('/api/users/sign_in', credentials)
      .then((response) => {
        localStorage.setItem('token', response.headers.authorization)
        const token = jwtDecode<{ role: string; sub: string }>(response.headers.authorization.replace('Bearer ', ''))
        localStorage.setItem('role', token.role)
        localStorage.setItem('id', token.sub)
        navigate('/')
      })
      .catch((error) => {
        setLoginFail(true)
      })
  }

  const loginAsExampleUser = () => {
    login('admin@example.com', 'password')
  }

  if (passwordChanged) {
    addAlertTimeout({ severity: 'success', message: 'Password changed' })
    setPasswordChanged(false)
  }

  return (
    <Box sx={{ bgcolor: 'primary.light', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onKeyDown={handleKeyDown} >
      <img
        style={{ display: 'flex', width: '64px', height: '64px' }}
        src={lambdeeLogo}
      />
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, minWidth: '248px', py: 3, px: 1, minHeight: '272px' }}>
        <Typography variant='h5' sx={{ mb: 3 }} color='primary'>Lambdee</Typography>
        <TextField
          inputRef={emailRef}
          slotProps={{ htmlInput: { id: 'login-email' } }}
          sx={{ mb: 2 }}
          label='Email'
          variant='outlined'
          onChange={verifyEmail}
          error={invalidEmail}
          helperText={invalidEmail ? 'Invalid email' : undefined}
        />
        <TextField inputRef={passwordRef}
          type='password'
          sx={{ mb: 2 }}
          label='Password'
          variant='outlined'
        />
        { loginFail &&
          <Alert
            severity='error'
            sx={{ width: '73%', mb: 2 }}
          >
            Incorrect credentials!
          </Alert>
        }
        <Link
          onClick={() => navigate('/login/forgot-password')}
          component='button'
          sx={{ display: 'flex', alignSelf: 'flex-start', ml: '9%', mb: '6%' }}
          underline='none'
          variant='body2'
        >
          Forgot password?
        </Link>
        <Button
          onClick={() => login()}
          sx={{ width: '192px' }}
          variant='contained'
          disabled={invalidEmail}
        >
          Login
        </Button>
        { process.env.NODE_ENV === 'development' &&
          <Link
            onClick={loginAsExampleUser}
            component='button'
            sx={{ mt: 1 }}
            underline='none'
            variant='body2'
          >
            Log in as example user
          </Link>
        }
      </Card>
    </Box>
  )
}
