import * as React from 'react'
import {
  Avatar,
  Popover
} from '@mui/material'
import PropTypes from 'prop-types'

import UserInfo from './task-card-modal/UserInfo'

const AvatarPopover = (props) => {
  const [anchorAvatarPopover, setAnchorAvatarPopover] = React.useState(null)

  const handleAvatarPopoverOpen = (event) => setAnchorAvatarPopover(event.currentTarget)
  const handleAvatarPopoverClose = () => setAnchorAvatarPopover(null)

  const open = Boolean(anchorAvatarPopover)

  return (
    <>
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
        <UserInfo userName={props.userName} userTitle={props.userTitle} />
      </Popover>
    </>
  )
}

AvatarPopover.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
  userTitle: PropTypes.string.isRequired
}


export default AvatarPopover
