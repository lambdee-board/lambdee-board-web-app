import * as React from 'react'
import { useParams } from 'react-router-dom'

import {
  Box,
  ListItem,
  IconButton,
  Avatar,
  Modal
} from '@mui/material'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import apiClient from '../../../api/axios-client'
import { mutateWorkspaceUsers } from '../../../api/workspace-users'
import useAppAlertStore from '../../../stores/app-alert'

import UserInfo from '../../task-card-modal/UserInfo'
import LabeledData from '../../LabeledData'
import CustomAlert from '../../custom-alert/CustomAlert'


interface Props {
  userId: number
  userAvatarUrl: string
  userName: string
  userTitle?: string
  userRegisterDate?: string
  userLoginDate?: string
  userRole?: string
  hideDelete?: boolean
}

const WorkspaceUser = ({ userId, userAvatarUrl, userName, userTitle, userRegisterDate, userLoginDate, hideDelete }: Props) => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { workspaceId } = useParams()
  const [alertModalState, setAlertModalState] = React.useState(false)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const removeUserFromWorkspace = () => {
    const unnasignedUser = { userId }

    apiClient.post(`/api/workspaces/${workspaceId}/unassign_user`, unnasignedUser)
      .then((response) => {
        addAlert({ severity: 'success', message: 'User unassigned!' })
        mutateWorkspaceUsers({
          id: workspaceId,
          data: (currentUsers) => currentUsers?.users?.filter((user) => user !== userId)
        })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const formatDate = (dateString: string) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  return (
    <Box>
      <Modal
        open={alertModalState}
        onClose={toggleAlertModalState}
      >
        <Box
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <CustomAlert confirmAction={removeUserFromWorkspace}
            dismissAction={toggleAlertModalState}
            title='Unassign User?'
            message={`Are you sure you want to unassign ${userName}?`}
            confirmMessage='Confirm, unassign user' />
        </Box>
      </Modal>
      <ListItem divider>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Avatar sx={{ mr: 1 }} src={userAvatarUrl} />
            <UserInfo userName={userName} userTitle={userTitle} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            { userLoginDate && <LabeledData label='Last Login' data={formatDate(userLoginDate)} />}
            { userRegisterDate && <LabeledData label='Registered' data={formatDate(userRegisterDate)} />}
          </Box>
        </Box>
        { !hideDelete &&
          <IconButton onClick={toggleAlertModalState}>
            <FontAwesomeIcon style={{ width: '18px', height: '18px', color: '#FF0000' }} icon={faTrash} />
          </IconButton>
        }
      </ListItem>
    </Box>
  )
}

export default WorkspaceUser
