import * as React from 'react'
import {
  List,
  Button,
  Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileImport,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

import useWorkspaceUsers  from '../../api/useWorkspaceUsers'
import WorkspaceUser from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceMembersView.sass'


export default function WorkspaceMembersView() {
  const { workspaceId } = useParams()
  const { data: users, mutate: mutateWorkspaceUsers } = useWorkspaceUsers({ id: workspaceId })

  return (
    <div className='WorkspaceMembers-wrapper'>
      <div className='WorkspaceMembers' >
        <List className='List'>
          <Button onClick={() => console.log('add user')} className='Add-user-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Add New User</Typography>
          </Button>
          <Button onClick={() => console.log('import users')} className='Import-users-button' color='primary' startIcon={<FontAwesomeIcon icon={faFileImport} />}>
            <Typography>Import From CSV</Typography>
          </Button>
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
      </div>
    </div>
  )
}
