import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '../api/api-client'
import useCurrentUser from '../api/current-user'
import useAppAlertStore from '../stores/app-alert'

import './UserSettingsView.sass'

function UserSettingsSkeleton() {
  return (
    <div className=''>
      <Skeleton variant='rectangular' width={160} height={40} />
    </div>
  )
}


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

  const capitalizeWords = (string) => {
    return string.replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase() })
  }

  const updateUserData = (requestBody) => {
    apiClient.put(`/api/users/${user.id}`, requestBody)
      .then((response) => {
        // successful request
        mutate()
        addAlert({ severity: 'success', message: 'Saved!' })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  const inputOnKeyEvent = (e, type) => {
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
    localStorage.clear()
    navigate('/login/reset-password')
  }


  if (isLoading || isError) return (
    <UserSettingsSkeleton  />
  )

  return (
    <div className='userSettings-wrapper'>
      <div className='userSettings-leftCol'>
        <List className='userSettings-list'
          subheader={<ListSubheader disableSticky={true} className='userSettings-header' >
            <Typography className='userSettings-header-text' fontSize={64}>
              Your Account
            </Typography>
          </ListSubheader>} >
          <Divider />
          <ListItem className='userSettings-item' key='user-name-input' >
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
          <ListItem className='userSettings-item' key='user-email-input' >
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
          <ListItem className='userSettings-item' key='user-role-input' >
            <TextField
              label='Role'
              disabled
              value={capitalizeWords(user.role)}
              variant='standard'
              fullWidth />
          </ListItem>
          <ListItem className='userSettings-item' key='user-reset-password' >
            <Button onClick={() => { console.log('reset-pass-TODO') }}
              className='userSettings-reset-password-button'
              color='primary'
              variant='contained' >
              <Typography onClick={handleResetPassword} className='userSettings-reset-password-button-text' >
                Reset Password
              </Typography>
            </Button>
          </ListItem>
        </List>
      </div>
      <div className='userSettings-rightCol'>
        <div className='userSettings-avatar-wrapper'>
          <IconButton className='userSettings-user-avatar-button'
            onClick={() => { console.log('avatar-TODO') }} >
            <Avatar
              className='userSettings-avatar'
              alt={`${user.name.replace(' ', '-')}-avatar`}
              src={user.avatarUrl} />
            <FontAwesomeIcon className='userSettings-avatar-edit'
              icon={faPencil} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}