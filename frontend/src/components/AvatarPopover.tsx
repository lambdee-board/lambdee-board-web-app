import * as React from 'react'
import {
  Avatar,
  Popover
} from '@mui/material'

import UserInfo from './task-card-modal/UserInfo'

interface Props {
  userName: string
  userAvatar: string
  userTitle: string
}

const AvatarPopover = ({ userName, userAvatar, userTitle }: Props) => {
  const [anchorAvatarPopover, setAnchorAvatarPopover] = React.useState<HTMLElement | null>(null)

  const handleAvatarPopoverOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorAvatarPopover(event.currentTarget)
  const handleAvatarPopoverClose = () => setAnchorAvatarPopover(null)

  const open = Boolean(anchorAvatarPopover)

  return (
    <>
      <Avatar
        aria-owns={open ? 'mouse-over-popover' : undefined}
        onMouseEnter={handleAvatarPopoverOpen}
        onMouseLeave={handleAvatarPopoverClose}
        className='AvatarPopover'
        alt={userName} src={userAvatar}
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
        <UserInfo userName={userName} userTitle={userTitle} />
      </Popover>
    </>
  )
}


export default AvatarPopover
