import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Stack
} from '@mui/material'
import PropTypes from 'prop-types'
import './ModalComment.sass'
import AvatarPopover from './AvatarPopover'

const ModalComment = (props) => {
  return (
    <Card className='ModalComment'>
      <Box className='ModalComment-info'>
        <AvatarPopover userName={props.userName} userAvatar={props.userAvatar} userTitle={props.userTitle} />
        <Stack>
          <Typography sx={{ pt: 0.5, pl: 0.5, pr: 0.5 }}>{props.userName}</Typography>
          <Typography sx={{ pb: 0.5, pl: 0.5, pr: 0.5 }} variant='caption'>Manager</Typography>
        </Stack>
      </Box>
    </Card>
  )
}

ModalComment.propTypes = {
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
  userTitle: PropTypes.string.isRequired,
  commentContent: PropTypes.string.isRequired,
  commentDate: PropTypes.string.isRequired
}


export default ModalComment
