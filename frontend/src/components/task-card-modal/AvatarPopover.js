import * as React from 'react'
import {
  Avatar,
  Box,
  Popover,
  Typography,
  Stack
} from '@mui/material'
import PropTypes from 'prop-types'
import './AvatarPopover.sass'

const AvatarPopover = (props) => {
  const [anchorAvatarPopover, setAnchorAvatarPopover] = React.useState(null)

  const handleAvatarPopoverOpen = (event) => {
    setAnchorAvatarPopover(event.currentTarget)
  }

  const handleAvatarPopoverClose = () => {
    setAnchorAvatarPopover(null)
  }
  const open = Boolean(anchorAvatarPopover)
  return (
    <Box className='AvatarPopover-wrapper'>
      <Avatar
        aria-owns={open ? 'mouse-over-popover' : undefined}
        onMouseEnter={handleAvatarPopoverOpen}
        onMouseLeave={handleAvatarPopoverClose}
        className='AvatarPopover'
        alt={props.userName} src={props.userAvatar}
      />
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorAvatarPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleAvatarPopoverClose}
        disableRestoreFocus
      >
        <Stack>
          <Typography sx={{ pt: 0.5, pl: 0.5, pr: 0.5 }}>{props.userName}</Typography>
          <Typography sx={{ pb: 0.5, pl: 0.5, pr: 0.5 }} variant='caption'>Manager</Typography>
        </Stack>

      </Popover>
    </Box>
  )
}

AvatarPopover.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
}


export default AvatarPopover
