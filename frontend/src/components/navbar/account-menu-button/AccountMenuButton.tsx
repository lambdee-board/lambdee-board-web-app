import React from 'react'
import {
  Box,
  IconButton,
  Typography,
  Menu,
  Avatar,
  MenuItem,
} from '@mui/material'

import { generatePath, useNavigate } from 'react-router'
import useCurrentUser from '../../../api/current-user'
import AccountMenuButtonSkeleton from './AccountMenuButtonSkeleton'

const AccountMenuButton = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<HTMLElement | null>(null)
  const { data: user, isLoading, isError } = useCurrentUser()

  const navigate = useNavigate()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  if (isLoading || isError) return (
    <AccountMenuButtonSkeleton />
  )

  return (
    <Box className='Box-user-menu-wrapper'>
      <IconButton className='IconButton-user-avatar' onClick={handleOpenUserMenu}>
        <Avatar alt={user.name} src={user.avatarUrl} />
      </IconButton>
      <Menu
        sx={{ mt: 1.5 }}
        id='user-menu'
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key={'user-account'}
          onClick={() => navigate(generatePath('account'))} >
          <Typography textAlign='center'>Account</Typography>
        </MenuItem>
        <MenuItem key={'logout'} onClick={handleLogout}>
          <Typography textAlign='center'>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AccountMenuButton
