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
import UserInfo from './UserInfo'

const ModalComment = (props) => {
  return (
    <Card className='ModalComment'>
      <Box className='ModalComment-info'>
        <AvatarPopover userName={props.userName} userAvatar={props.userAvatar} userTitle={props.userTitle} />
        <UserInfo userName={props.userName} userTitle={props.userTitle} />
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
