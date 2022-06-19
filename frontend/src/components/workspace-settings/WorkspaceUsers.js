import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  ListItem,
  IconButton,
  Avatar,
} from '@mui/material'
import {
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addAlert } from '../../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import UserInfo from './../task-card-modal/UserInfo'

import './WorkspaceUsers.sass'


const WorkspaceUsers = (props) => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const deleteUser = () => {
    const unnasignedUser = {
      userId: props.userId
    }
    apiClient.post(`/api/workspaces/${workspaceId}/unassign_user`, unnasignedUser)
      .then((response) => {
        dispatch(addAlert({ severity: 'success', message: 'User unassigned!' }))
        props.mutate()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  return (

    <Box>
      <ListItem button divider>
        <Box className='UserListItem'>
          <Avatar className='UserListItem-avatar' src={props.userAvatarUrl} />
          <UserInfo userName={props.userName} userTitle={props.userTitle} />
        </Box>
        <IconButton onClick={deleteUser}>
          <FontAwesomeIcon className='DeleteUser-icon' icon={faTrash} />
        </IconButton>
      </ListItem>

    </Box>
  )
}

export default WorkspaceUsers

WorkspaceUsers.propTypes = {
  userId: PropTypes.number.isRequired,
  userAvatarUrl: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userTitle: PropTypes.string,
  mutate: PropTypes.func.isRequired
}
