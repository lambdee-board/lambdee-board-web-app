import * as React from 'react'
import {
  Typography,
  Stack
} from '@mui/material'
import PropTypes from 'prop-types'


const UserInfo = (props) => {
  return (
    <Stack>
      <Typography sx={{ pt: 0.5, pl: 1, pr: 0.5 }}>{props.userName}</Typography>
      <Typography sx={{ pb: 0.5, pl: 1, pr: 0.5 }} variant='caption'>{props.userTitle}</Typography>
    </Stack>
  )
}

UserInfo.propTypes = {
  userName: PropTypes.string.isRequired,
  userTitle: PropTypes.string.isRequired,
}

export default UserInfo