import * as React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import {
  Box,
  ListItem,
  IconButton,
  Avatar,
  Skeleton
} from '@mui/material'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '../../api/apiClient'
import { mutateWorkspaceUsers } from '../../api/useWorkspaceUsers'
import useAppAlertStore from '../../stores/app-alert'

import UserInfo from '../task-card-modal/UserInfo'
import LabeledData from '../LabeledData'

import './WorkspaceUser.sass'

const WorkspaceUserSkeleton = () => {
  return (
    <div>
      <ListItem divider>
        <div className='UserListItem'>
          <div className='UserListItem-base'>
            <Avatar className='UserListItem-avatar' />
            <Skeleton height={36} width={200} variant='text' />
          </div>
          <Skeleton height={36} width={100} variant='text' />
          <Skeleton height={36} width={100} variant='text' />
        </div>
      </ListItem>
    </div>
  )
}

const WorkspaceUser = (props) => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { workspaceId } = useParams()

  const removeUserFromWorkspace = () => {
    const unnasignedUser = { userId: props.userId }

    apiClient.post(`/api/workspaces/${workspaceId}/unassign_user`, unnasignedUser)
      .then((response) => {
        addAlert({ severity: 'success', message: 'User unassigned!' })
        mutateWorkspaceUsers({
          id: workspaceId,
          data: (currentUsers) => currentUsers?.users?.filter((user) => user !== props.userId)
        })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const formatDate = (dateString) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  return (
    <Box>
      <ListItem divider>
        <Box className='UserListItem'>
          <div className='UserListItem-base'>
            <Avatar className='UserListItem-avatar' src={props.userAvatarUrl} />
            <UserInfo userName={props.userName} userTitle={props.userTitle} />
          </div>
          <div className='UserListItem-dates'>
            { props.userLoginDate && <LabeledData label='Last Login' data={formatDate(props.userLoginDate)} />}
            { props.userRegisterDate && <LabeledData label='Registered' data={formatDate(props.userRegisterDate)} />}
          </div>
        </Box>
        { !props.hideDelete &&
          <IconButton onClick={removeUserFromWorkspace}>
            <FontAwesomeIcon className='DeleteUser-icon' icon={faTrash} />
          </IconButton>
        }
      </ListItem>
    </Box>
  )
}

export default WorkspaceUser
export { WorkspaceUserSkeleton }

WorkspaceUser.propTypes = {
  userId: PropTypes.number.isRequired,
  userAvatarUrl: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userTitle: PropTypes.string,
  userRegisterDate: PropTypes.string,
  userLoginDate: PropTypes.string,
  userRole: PropTypes.string,
  hideDelete: PropTypes.bool
}
