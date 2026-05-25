import * as React from 'react'
import { useParams } from 'react-router-dom'

import {
  Box,
  List,
  Button,
  Typography
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList,
  faPlus
} from '@fortawesome/free-solid-svg-icons'

import apiClient from '../../../api/axios-client'
import useWorkspace from '../../../api/workspace'
import useWorkspaceUsers from '../../../api/workspace-users'
import useAppAlertStore from '../../../stores/app-alert'
import type { UserShort } from '../../../types'

import WorkspaceLabel from '../../../components/workspace-settings/workspace-label/WorkspaceLabel'
import NewBoardButton from '../../../components/new-board-button/NewBoardButton'
import WorkspaceBoard from '../../../components/workspace-settings/workspace-board/WorkspaceBoard'
import WorkspaceUser from '../../../components/workspace-settings/workspace-user/WorkspaceUser'
import WorkspaceAssignUserSelect from '../../../components/workspace-settings/WorkspaceAssignUserSelect'


const WorkspaceSettings = () => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  const { data: usersData, mutate: mutateWorkspaceUsers } = useWorkspaceUsers({ id: workspaceId })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)

  const assignUserButtonOnClick = () => {
    setAssignUserSelectVisible(true)
    setTimeout(() => {
      document.getElementById('assign-user-to-workspace-select')?.focus()
    }, 50)
  }

  const assignUserSelectOnBlur = () => {
    setAssignUserSelectVisible(false)
  }

  const assignUserSelectOnChange = (e: React.SyntheticEvent, user: UserShort | null) => {
    if (user) assignUser(user)
    setAssignUserSelectVisible(false)
  }

  const assignUser = (user: UserShort) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/workspaces/${workspaceId}/assign_user`, payload)
      .then((response) => {
        mutateWorkspaceUsers((currentUsers) => ({ ...currentUsers!, users: [...currentUsers!.users, user] }))
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  return (

    <Box sx={{ overflow: 'hidden', msOverflowStyle: 'none', scrollbarWidth: 'none', pt: 1, pl: 2.5, pr: 1.5, pb: 1 }}>
      <Box sx={{ bgcolor: 'primary.light', display: 'inline-flex', flexFlow: 'column', borderRadius: '8px', width: '100%', minHeight: 'calc(100vh - 80px)' }}>
        {isLoading || isError ? (
          <Box></Box>
        ) : (
          <List sx={{ pb: 0, mb: 0 }}>
            <WorkspaceLabel
              workspace={workspace}
            />
            <NewBoardButton />
            <Box sx={{ mb: 2 }}>
              {workspace.boards?.map((board) => (
                <WorkspaceBoard
                  key={board.id}
                  boardId={board.id}
                  boardName={board.name}
                  boardColor={board.color}
                  icon={<FontAwesomeIcon style={{ width: '24px', height: '24px' }} icon={faClipboardList} color={board.color} />}
                />

              ))}
            </Box>
            {assignUserSelectVisible ? (
              <WorkspaceAssignUserSelect
                onBlur={assignUserSelectOnBlur}
                onChange={assignUserSelectOnChange}
                assignedUsers={usersData?.users}
              />
            ) : (
              <Button onClick={assignUserButtonOnClick} className='New-board-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
                <Typography>Assign New User</Typography>
              </Button>
            )}
            {usersData?.users?.map((user) => (
              <WorkspaceUser
                key={user.id}
                userId={user.id}
                userName={user.name}
                userTitle={user.role}
                userAvatarUrl={user.avatarUrl}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}

export default WorkspaceSettings
