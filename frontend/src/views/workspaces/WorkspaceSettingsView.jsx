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

import apiClient from '../../api/api-client'
import useWorkspace from '../../api/workspace'
import useWorkspaceUsers  from '../../api/workspace-users'
import useAppAlertStore from '../../stores/app-alert'

import WorkspaceLabel from '../../components/workspace-settings/WorkspaceLabel'
import NewBoardButton from '../../components/NewBoardButton'
import WorkspaceBoard from '../../components/workspace-settings/WorkspaceBoard'
import WorkspaceUser from '../../components/workspace-settings/WorkspaceUser'
import WorkspaceAssignUserSelect from '../../components/workspace-settings/WorkspaceAssignUserSelect'

import './WorkspaceSettingsView.sass'

const WorkspaceSettings = () => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  const { data: usersData, mutate: mutateWorkspaceUsers } = useWorkspaceUsers({ id: workspaceId })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)

  const assignUserButtonOnClick = () => {
    setAssignUserSelectVisible(true)
    setTimeout(() => {
      document.getElementById('assign-user-to-workspace-select').focus()
    }, 50)
  }

  const assignUserSelectOnBlur = () => {
    setAssignUserSelectVisible(false)
  }

  const assignUserSelectOnChange = (e, user) => {
    assignUser(user)
    setAssignUserSelectVisible(false)
  }

  const assignUser = (user) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/workspaces/${workspaceId}/assign_user`, payload)
      .then((response) => {
        // successful request
        mutateWorkspaceUsers((currentUsers) => ([...currentUsers.users, user]))
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  return (

    <div className='WorkspaceSettings-wrapper'>
      <div className='WorkspaceSettings' >
        {isLoading || isError ? (
          <div></div>
        ) : (
          <List className='List'>
            <WorkspaceLabel
              workspace={workspace}
            />
            <NewBoardButton />
            <div className='WorkspaceBoards'>
              {workspace.boards?.map((board) => (
                <WorkspaceBoard
                  key={board.id}
                  boardId={board.id}
                  boardName={board.name}
                  boardColor={board.colour}
                  icon={<FontAwesomeIcon className='WorkspaceBoards-icon' icon={faClipboardList} color={board.colour} />}
                />

              ))}
            </div>
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
            {usersData?.users?.map((user, index) => (
              <WorkspaceUser
                key={user.name + index}
                userId={user.id}
                userName={user.name}
                userTitle={user.role}
                userAvatarUrl={user.avatarUrl}
              />
            ))}
          </List>
        )}
      </div>
    </div>
  )
}

export default WorkspaceSettings


