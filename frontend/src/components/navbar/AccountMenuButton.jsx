import React from 'react'
import {
  Box,
  IconButton,
  Typography,
  Menu,
  Avatar,
  MenuItem,
  Skeleton
} from '@mui/material'

import { generatePath, useNavigate } from 'react-router'
import useCurrentUser from '../../api/current-user'

const AccountMenuButton = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const { data: user, isLoading, isError } = useCurrentUser()

  const navigate = useNavigate()

  const handleOpenUserMenu = (event) => {
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
    <Skeleton variant='circular' width={40} height={40} />
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
