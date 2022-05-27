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

import useCurrentUser from '../../api/useCurrentUser'

const AccountMenuButton = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  // TODO: User id should be derived from a Cookie
  const { data: user, isLoading, isError } = useCurrentUser()
  const settings = ['Account', 'Logout']

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
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
        {settings.map((setting, index) => (
          <MenuItem key={`${setting}-${index}`} onClick={handleCloseUserMenu}>
            <Typography textAlign='center'>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default AccountMenuButton
