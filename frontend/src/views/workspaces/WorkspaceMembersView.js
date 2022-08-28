import * as React from 'react'
import {
  List,
  Button,
  Typography,
  Pagination
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileImport,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

import useWorkspaceUsers from '../../api/useWorkspaceUsers'
import WorkspaceUser from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceMembersView.sass'
import apiClient from '../../api/apiClient'
import { useDispatch } from 'react-redux'
import { addAlert } from '../../redux/slices/appAlertSlice'


export default function WorkspaceMembersView() {
  const dispatch = useDispatch()
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(0)
  const { workspaceId } = useParams()
  const requestParams = { id: workspaceId, axiosOptions: { params: { page, per: 2 } } }
  const { data: usersData, mutate: mutateWorkspaceUsers } = useWorkspaceUsers(requestParams)

  React.useEffect(() => {
    if (!usersData?.totalPages) return

    setTotalPages(usersData?.totalPages)
  }, [usersData?.totalPages])

  const changeRole = (userId, payload) => {
    apiClient.put(`/api/users/${userId}`, payload)
      .then((response) => {
      // successful request
        mutateWorkspaceUsers(requestParams)
      })
      .catch((error) => {
      // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const fetchNextUserPage = (event, value) => {
    setPage(value)
    mutateWorkspaceUsers(requestParams)
  }

  return (
    <div className='WorkspaceMembers-wrapper'>
      <div className='WorkspaceMembers' >
        <div className='button-row'>
          <Button onClick={() => console.log('add user')} className='WorkspaceMembers-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Add New User</Typography>
          </Button>
          <Button onClick={() => console.log('import users')} className='WorkspaceMembers-button' color='primary' startIcon={<FontAwesomeIcon icon={faFileImport} />}>
            <Typography>Import From CSV</Typography>
          </Button>
        </div>
        <List className='List'>
          {usersData?.users?.map((user, index) => (
            <WorkspaceUser
              key={user.name + index}
              userId={user.id}
              userName={user.name}
              userTitle={user.role}
              userAvatarUrl={user.avatarUrl}
              userRegisterDate={user.createdAt}
              userLoginDate={user.createdAt}
              userRole={user.role}
              onRoleChange={changeRole}
            />
          ))}
        </List>
        <Pagination className='Pagination-bar' count={totalPages || 0} color='primary' onChange={fetchNextUserPage} size='large' />
      </div>
    </div>
  )
}
