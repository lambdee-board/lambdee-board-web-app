import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListSubheader,
  TextField,
  Typography,
} from '@mui/material'

import apiClient from '../../api/axios-client'
import useCurrentUser from '../../api/current-user'
import useAppAlertStore from '../../stores/app-alert'
import UserSettingsViewSkeleton from './UserSettingsViewSkeleton'



export default function UserSettingsView() {
  const { data: user, isLoading, isError, mutate } = useCurrentUser()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [name, setNewName] = React.useState('')
  const [email, setNewEmail] = React.useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) {
      setNewName(user.name)
      setNewEmail(user.email)
    }
  }, [user])

  const capitalizeWords = (string: string) => {
    return string.replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase() })
  }

  const updateUserData = (requestBody: Record<string, string>) => {
    apiClient.put(`/api/users/${user.id}`, requestBody)
      .then((response) => {
        mutate()
        addAlert({ severity: 'success', message: 'Saved!' })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const inputOnKeyEvent = (e: React.KeyboardEvent, type: string) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()

      switch (type) {
      case 'name':
        if (name) updateUserData({ name })
        else addAlert({ severity: 'error', message: 'Cannot send empty value!' })
        break
      case 'email':
        if (email) updateUserData({ email })
        else addAlert({ severity: 'error', message: 'Cannot send empty value!' })
        break
      }
      break

    case 'Escape':
      e.preventDefault()
      setNewName(user.name)
      setNewEmail(user.email)
      break
    }
  }

  const handleResetPassword = () => {
    apiClient.post('/api/users/send_reset_password')
      .then((response) => {
        localStorage.clear()
        navigate('/login/password-reset')
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  if (isLoading || isError) return (
    <UserSettingsViewSkeleton />
  )

  return (
    <Box sx={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)', maxWidth: 'calc(100% - 16px)', minHeight: 'calc(100vh - 80px)', m: 1, borderRadius: '8px', display: 'inline-flex', flexDirection: 'row' }}>
      <Box sx={{ width: 'calc(60vw - 64px)', m: 4 }}>
        <List
          subheader={<ListSubheader disableSticky={true} sx={{ background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
            <Typography sx={{ fontSize: '64px' }}>
              Your Account
            </Typography>
          </ListSubheader>} >
          <Divider />
          <ListItem sx={{ my: 2 }} key='user-name-input' >
            <TextField
              label='Name'
              value={name}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => inputOnKeyEvent(e, 'name')}
              onBlur={() => setNewName(user.name)}
              placeholder='Your name'
              variant='standard'
              fullWidth
              autoComplete='off' />
          </ListItem>
          <ListItem sx={{ my: 2 }} key='user-email-input' >
            <TextField
              label='Email'
              value={email}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => inputOnKeyEvent(e, 'email')}
              onBlur={() => setNewEmail(user.email)}
              placeholder='Your email'
              variant='standard'
              fullWidth
              autoComplete='off' />
          </ListItem>
          <ListItem sx={{ my: 2 }} key='user-role-input' >
            <TextField
              label='Role'
              disabled
              value={capitalizeWords(user.role)}
              variant='standard'
              fullWidth />
          </ListItem>
          <ListItem sx={{ my: 2 }} key='user-reset-password' >
            <Button
              onClick={handleResetPassword}
              sx={{ width: '280px', p: 1 }}
              color='primary'
              variant='contained'
            >
              <Typography sx={{ fontSize: '0.8rem' }}>
                Reset Password
              </Typography>
            </Button>
          </ListItem>
        </List>
      </Box>
      <Box sx={{ width: 'calc(40vw - 64px)', m: 4 }}>
        <Box sx={{ mt: 5, ml: 5 }}>
          <Avatar
            sx={{ width: '192px', height: '192px', transition: '.3s all' }}
            alt={`${user.name.replace(' ', '-')}-avatar`}
            src={user.avatarUrl} />
        </Box>
      </Box>
    </Box>
  )
}
