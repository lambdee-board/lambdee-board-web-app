import * as React from 'react'

import {
  List,
  Pagination,
  Typography
} from '@mui/material'

import useWorkspaces from '../../api/workspaces'
import useUsers, { mutateUsers } from '../../api/users'

import UsersFilter from '../../components/UsersFilter'
import WorkspaceUser, { WorkspaceUserSkeleton } from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceMembersView.sass'

export default function WorkspaceMembersView() {
  const perPage = 7
  const [filter, setFilter] = React.useState({ page: 1, per: perPage })
  const { data: usersData, isLoading, isError } = useUsers({ axiosOptions: { params: filter } })

  const [totalPages, setTotalPages] = React.useState(0)
  const { data, workspacesLoading, workspacesError } = useWorkspaces({})
  const workspaces = data ? data.workspaces : null

  React.useEffect(() => {
    if (!usersData?.totalPages) return

    setTotalPages(usersData?.totalPages)
  }, [usersData?.totalPages])

  const fetchNextUserPage = (event, newPage) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutateUsers({ axiosOptions: { params: newFilterPage }, data: { ...usersData, totalPages } })
  }

  const updateFilters = (newFilter) => {
    const validFilter = Object.fromEntries(
      Object.entries(newFilter).filter(([_, v]) => v !== '')
    )
    validFilter.per = perPage
    validFilter.page = 1

    // console.log(validFilter)
    setFilter(validFilter)
  }

  const checkIfAnyUsers = () => {
    if (usersData?.users.length > 0) {
      return usersData?.users?.map((user, index) => (
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
      ))
    }
    return <Typography className='no-users-text'>No users found</Typography>
  }

  return (
    <div className='WorkspaceMembers-wrapper'>
      <div className='WorkspaceMembers' >
        <div className='list-wrapper'>
          <List className='List' sx={{ height: `${perPage * 70}px` }}>
            { !(isLoading || isError) ?
              checkIfAnyUsers() :
              [...Array(5)].map((val, idx) => {
                return <WorkspaceUserSkeleton key={idx} />
              })
            }
          </List>
          { usersData?.totalPages > 1 &&
              <Pagination
                className='Pagination-bar'
                count={totalPages || 0}
                color='primary'
                onChange={fetchNextUserPage}
                size='large'
                page={filter.page} />
          }
        </div>
        <div className='filter-wrapper'>
          <UsersFilter
            workspaces={workspaces || []}
            dataLoadingOrError={!!(workspacesLoading || workspacesError)}
            updateFilters={updateFilters}
          />
        </div>
      </div>
    </div>
  )
}
