import * as React from 'react'

import {
  Box,
  List,
  Pagination,
  Typography
} from '@mui/material'

import useWorkspaces from '../../../api/workspaces'
import useUsers, { mutateUsers } from '../../../api/users'
import type { Workspace } from '../../../types'

import UsersFilter from '../../../components/users-filter/UsersFilter'
import WorkspaceUser from '../../../components/workspace-settings/workspace-user/WorkspaceUser'
import WorkspaceUserSkeleton from '../../../components/workspace-settings/workspace-user/WorkspaceUserSkeleton'


export default function WorkspaceMembersView() {
  const perPage = 7
  const [filter, setFilter] = React.useState<Record<string, unknown>>({ page: 1, per: perPage })
  const { data: usersData, isLoading, isError } = useUsers({ axiosOptions: { params: filter } })

  const [totalPages, setTotalPages] = React.useState(0)
  const { data, isLoading: workspacesLoading, isError: workspacesError } = useWorkspaces({})
  const workspaces: Workspace[] | null = data ? data.workspaces : null

  React.useEffect(() => {
    if (!usersData?.totalPages) return

    setTotalPages(usersData?.totalPages)
  }, [usersData?.totalPages])

  const fetchNextUserPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if ((filter.page as number) === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutateUsers({ axiosOptions: { params: newFilterPage }, data: { ...usersData, totalPages } })
  }

  const updateFilters = (newFilter: Record<string, unknown>) => {
    const validFilter = Object.fromEntries(
      Object.entries(newFilter).filter(([_, v]) => v !== '')
    )
    validFilter.per = perPage
    validFilter.page = 1

    setFilter(validFilter)
  }

  const checkIfAnyUsers = () => {
    if (usersData?.users.length > 0) {
      return usersData?.users?.map((user) => (
        <WorkspaceUser
          key={user.id}
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
    return <Typography sx={{ width: '100%', fontSize: '48px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', color: 'rgba(2, 159, 209, 0.3)' }}>No users found</Typography>
  }

  return (
    <Box sx={{ pt: 1, pl: 2.5, pr: 1.5, pb: 1 }}>
      <Box sx={{ display: 'flex', flexFlow: 'row', width: '100%', minHeight: 'calc(100vh - 80px)' }}>
        <Box sx={{ width: '100%' }}>
          <List sx={{ height: 'fit-content', pb: 0, mb: 0 }}>
            { !(isLoading || isError) ?
              checkIfAnyUsers() :
              [...Array(5)].map((val, idx) => {
                return <WorkspaceUserSkeleton key={idx} />
              })
            }
          </List>
          { usersData?.totalPages > 1 &&
              <Pagination
                sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}
                count={totalPages || 0}
                color='primary'
                onChange={fetchNextUserPage}
                size='large'
                page={filter.page as number} />
          }
        </Box>
        <Box sx={{ maxWidth: '360px', ml: 1 }}>
          <UsersFilter
            workspaces={workspaces || []}
            dataLoadingOrError={!!(workspacesLoading || workspacesError)}
            updateFilters={updateFilters}
          />
        </Box>
      </Box>
    </Box>
  )
}
