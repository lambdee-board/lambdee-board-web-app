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

import useWorkspaceUsers, { mutateWorkspaceUsers }  from '../../api/useWorkspaceUsers'
import WorkspaceUser from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceMembersView.sass'


export default function WorkspaceMembersView() {
  const [page, setPage] = React.useState(1)
  const { workspaceId } = useParams()
  const { data: users } = useWorkspaceUsers({ id: workspaceId, axiosOptions: { params: { page, per: 10 } } })

  const fetchNextUserPage = (event, value) => {
    setPage(value)
    mutateWorkspaceUsers({ id: workspaceId, axiosOptions: { params: { page, per: 10 } } })
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
          {users?.map((user, index) => (
            <WorkspaceUser
              key={user.name + index}
              userId={user.id}
              userName={user.name}
              userTitle={user.role}
              userAvatarUrl={user.avatarUrl}
              userRegisterDate={user.createdAt}
              userLoginDate={user.createdAt}
              userRole={user.role}
              onRoleChange={mutateWorkspaceUsers}
            />
          ))}
        </List>
        <Pagination className='Pagination-bar' count={10} color='primary' onChange={fetchNextUserPage} size='large' />
      </div>
    </div>
  )
}
