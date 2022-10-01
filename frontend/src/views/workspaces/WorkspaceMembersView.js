import * as React from 'react'
import {
  List,
  Button,
  Typography,
  Pagination
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'

import useWorkspaceUsers from '../../api/useWorkspaceUsers'
import WorkspaceUser, { WorkspaceUserSkeleton } from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceMembersView.sass'

import UsersFilter from '../../components/UsersFilter'
import useWorkspaces from '../../api/useWorkspaces'


export default function WorkspaceMembersView() {
  const [page, setPage] = React.useState(1)
  const [filter, setFilter] = React.useState({ page, per: 5 })
  const requestParams = { id: 1, axiosOptions: { params: filter } }
  const { data: usersData, mutate: mutateWorkspaceUsers, isLoading, isError } = useWorkspaceUsers(requestParams)

  const [totalPages, setTotalPages] = React.useState(0)
  const { data: workspaces, workspacesLoading, workspacesError } = useWorkspaces({})

  React.useEffect(() => {
    if (!usersData?.totalPages) return

    setTotalPages(usersData?.totalPages)
  }, [usersData?.totalPages])

  const fetchNextUserPage = (event, value) => {
    if (page === value) return

    setPage(value)
    mutateWorkspaceUsers(requestParams)
  }

  const updateFilters = () => {
    setFilter({ page, per: 5 })
  }

  return (
    <div className='WorkspaceMembers-wrapper'>
      <div className='WorkspaceMembers' >
        <div className='button-row'>
          <Button onClick={() => console.log('add user')} className='WorkspaceMembers-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Add New User</Typography>
          </Button>
        </div>
        <div className='content-row'>
          <List className='List'>
            { !(isLoading || isError) ? usersData?.users?.map((user, index) => (
              <WorkspaceUser
                key={user.name + index}
                userId={user.id}
                userName={user.name}
                userTitle={user.role}
                userAvatarUrl={user.avatarUrl}
                userRegisterDate={user.createdAt}
                userLoginDate={user.createdAt}
                userRole={user.role}
                hideDelete={true}
              />
            )) : (
              [...Array(5)].map((val, idx) => {
                return <WorkspaceUserSkeleton key={idx} />
              })
            )}
          </List>
          <UsersFilter
            workspaces={workspaces || []}
            dataLoadingOrError={!!(workspacesLoading || workspacesError)}
            updateFilters={updateFilters}
          />
        </div>
        <Pagination className='Pagination-bar' count={totalPages || 0} color='primary' onChange={fetchNextUserPage} size='large' />
      </div>
    </div>
  )
}
