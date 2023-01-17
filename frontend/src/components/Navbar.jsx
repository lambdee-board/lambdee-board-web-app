import * as React from 'react'

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button
} from '@mui/material'
import { RegularContent, DeveloperContent } from '../permissions/content'

import AccountMenuButton from './navbar/AccountMenuButton'
import WorkspacesMenuButton from './navbar/WorkspacesMenuButton'
import RecentMenuButton from './navbar/RecentMenuButton'

import lambdeeLogo from '../assets/lambdee-logo.svg'
import './Navbar.sass'
import { useNavigate } from 'react-router-dom'
import ScriptMenuButton from './navbar/ScriptMenuButton'


const Navbar = () => {
  const navigate = useNavigate()

  return (
    <AppBar className='Navbar' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth='false'>
        <Toolbar disableGutters>
          <Button
            onClick={() => {
              localStorage.setItem('sidebarSelected', 'workspace')
              navigate('/')
            }}>
            <img
              className='logo'
              src={lambdeeLogo}
            />
            <Typography
              className='Typography-logo-title'
              sx={{ textTransform: 'none ' }}
              color='white'
              variant='h6'
            >
            Lambdee
            </Typography>
          </Button>
          <Box className='Box-dropdown-button-group'>
            <WorkspacesMenuButton />
            <RecentMenuButton />
            <RegularContent>
              <ScriptMenuButton />
              <Button
                className='Button'
                id='dropdown-button'
                onClick={() => navigate('/tasks')}
              >

                <Typography variant='button' color='common.white' sx={{ textTransform: 'capitalize', mr: '32px' }}>
                Tasks
                </Typography>
              </Button>
            </RegularContent>
            <Button
              className='Button'
              id='dropdown-button'
              onClick={() => navigate('/members')}
            >
              <Typography variant='button' color='common.white' sx={{ textTransform: 'capitalize', marginRight: '32px' }}>
                Members
              </Typography>
            </Button>
            <DeveloperContent>
              <Button
                className='Button'
                id='dropdown-button'
                onClick={() => navigate('/console')}
              >
                <Typography variant='button' color='common.white' sx={{ textTransform: 'capitalize', marginRight: '32px' }}>
                Console
                </Typography>
              </Button>
            </DeveloperContent>


          </Box>
          <AccountMenuButton />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
