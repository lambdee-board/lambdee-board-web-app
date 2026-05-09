import * as React from 'react'
import {
  Typography,
  Stack
} from '@mui/material'

interface Props {
  userName: string
  userTitle?: string
}

const UserInfo = ({ userName, userTitle }: Props) => {
  return (
    <Stack>
      <Typography sx={{ pt: 0.5, pl: 1, pr: 0.5 }}>{userName}</Typography>
      <Typography noWrap sx={{ pb: 0.5, pl: 1, pr: 0.5, display: 'block', maxWidth: '500px' }} variant='caption'>{userTitle}</Typography>
    </Stack>
  )
}

export default UserInfo
