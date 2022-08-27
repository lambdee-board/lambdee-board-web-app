import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  ListItem,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'

import { addAlert } from '../../redux/slices/appAlertSlice'
import apiClient from '../../api/apiClient'
import { mutateWorkspaceUsers } from '../../api/useWorkspaceUsers'

import './WorkspaceUser.sass'
import UserInfo from '../task-card-modal/UserInfo'
import LabeledData from '../LabeledData'

const WorkspaceUser = (props) => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()

  const deleteUser = () => {
    const unnasignedUser = { userId: props.userId }

    apiClient.post(`/api/workspaces/${workspaceId}/unassign_user`, unnasignedUser)
      .then((response) => {
        dispatch(addAlert({ severity: 'success', message: 'User unassigned!' }))
        mutateWorkspaceUsers({
          id: workspaceId,
          data: (currentUsers) => currentUsers.filter((user) => user !== props.userId)
        })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const formatDate = (dateString) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  const updateUserRole = (event) => {
    console.log(event.target.value)
    const payload = { role: event.target.value }
    apiClient.put(`/api/users/${props.userId}`, payload)
      .then((response) => {
        // successful request
        props.onRoleChange()
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
          <div className='UserListItem-base'>
            <Avatar className='UserListItem-avatar' src={props.userAvatarUrl} />
            <UserInfo userName={props.userName} userTitle={props.userTitle} />
          </div>
          { props.userLoginDate && <LabeledData label='Last Login' data={formatDate(props.userLoginDate)} />}
          { props.userRegisterDate && <LabeledData label='Registered' data={formatDate(props.userRegisterDate)} />}
          { props.userRole &&
            <FormControl variant='standard' className='xd'>
              <InputLabel id='UserListItem-role-label'>Role</InputLabel>
              <Select
                id='UserListItem-select'
                value={props.userRole}
                label='Role'
                onChange={updateUserRole}
              >
                <MenuItem value='guest'>Guest</MenuItem>
                <MenuItem value='regular'>Regular</MenuItem>
                <MenuItem value='developer'>Developer</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='manager'>Manager</MenuItem>
              </Select>
            </FormControl>
          }
        </Box>
        <IconButton onClick={deleteUser}>
          <FontAwesomeIcon className='DeleteUser-icon' icon={faTrash} />
        </IconButton>
      </ListItem>
    </Box>
  )
}

export default WorkspaceUser

WorkspaceUser.propTypes = {
  userId: PropTypes.number.isRequired,
  userAvatarUrl: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userTitle: PropTypes.string,
  userRegisterDate: PropTypes.string,
  userLoginDate: PropTypes.string,
  userRole: PropTypes.string,
  onRoleChange: PropTypes.func,
}
