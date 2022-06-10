import { Avatar, Button, Divider, List, ListItem, ListSubheader, Skeleton, TextField, Typography } from '@mui/material'
import { capitalize } from 'lodash'
import React from 'react'
import { useDispatch } from 'react-redux'

import apiClient from '../../api/apiClient'
import useCurrentUser from '../../api/useCurrentUser'
import { addAlert } from '../../redux/slices/appAlertSlice'
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

  function capitalizeWords(string) {
    return string.replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase() })
  }

  if (isLoading || isError) return (
    <UserSettingsSkeleton  />
  )

  return (
    <div className='userSettings-wrapper'>
      <div className='userSettings-leftCol'>
        <List className='userSettings-list'
          subheader={<ListSubheader className='userSettings-header' >
            <Typography className='userSettings-header-text' fontSize={64}>
              Your Account
            </Typography>
          </ListSubheader>} >
          <Divider />
          <ListItem className='userSettings-item' key='user-name-input' >
            <TextField
              label='Name'
              defaultValue={user.name}
              placeholder='Your name'
              variant='standard'
              fullWidth
            />
          </ListItem>
          <ListItem className='userSettings-item' key='user-email-input' >
            <TextField
              label='Email'
              defaultValue={user.email}
              placeholder='Your email'
              variant='standard'
              fullWidth />
          </ListItem>
          <ListItem className='userSettings-item' key='user-role-input' >
            <TextField
              label='Role'
              disabled
              defaultValue={capitalizeWords(user.role)}
              variant='standard'
              fullWidth
              sx={{ textTransform: capitalize }} />
          </ListItem>
          <ListItem className='userSettings-item' key='user-reset-password' >
            <Button onClick={() => { console.log('TODO') }}
              className='userSettings-reset-password-button'
              color='primary'
              variant='contained' >
              <Typography className='userSettings-reset-password-button-text' >
                Reset Password
              </Typography>
            </Button>
          </ListItem>
        </List>
      </div>
      <div className='userSettings-rightCol'>
        <div className='userSettings-avatar-wrapper'>
          <Avatar
            className='userSettings-avatar'
            alt={`${user.name.replace(' ', '-')}-avatar`}
            src={user.avatarUrl}
          />
        </div>
      </div>
    </div>
  )
}
