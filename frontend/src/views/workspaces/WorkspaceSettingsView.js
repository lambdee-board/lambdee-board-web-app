import * as React from 'react'
import {
  Box,
  List,
  Button,
  Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { addAlert } from '../../redux/slices/appAlertSlice'
import apiClient from '../../api/apiClient'
import useWorkspace from '../../api/useWorkspace'
import useWorkspaceUsers  from '../../api/useWorkspaceUsers'

import './WorkspaceSettingsView.sass'

import WorkspaceLabel from '../../components/workspace-settings/WorkspaceLabel'
import NewBoardButton from '../../components/NewBoardButton'
import WorkspaceBoard from '../../components/workspace-settings/WorkspaceBoard'
import WorkspaceUser from '../../components/workspace-settings/WorkspaceUser'
import WorkspaceAssignUserSelect from '../../components/workspace-settings/WorkspaceAssignUserSelect'

const WorkspaceSettings = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  const { data: users, mutate: mutateWorkspaceUsers } = useWorkspaceUsers({ id: workspaceId })
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
        mutateWorkspaceUsers((currentUsers) => ([...currentUsers, user]))
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  return (

    <Box className='WorkspaceSettings-wrapper'>
      <Box className='WorkspaceSettings' >
        {isLoading || isError ? (
          <Box></Box>
        ) : (
          <List className='List'>
            <WorkspaceLabel
              workspace={workspace}
            />
            <NewBoardButton />
            <Box className='WorkspaceBoards'>
              {workspace.boards?.map((board) => (
                <WorkspaceBoard
                  key={board.id}
                  boardId={board.id}
                  boardName={board.name}
                  boardColor={board.colour}
                  icon={<FontAwesomeIcon className='WorkspaceBoards-icon' icon={faClipboardList} color={board.colour} />}
                />

              ))}
            </Box>
            {assignUserSelectVisible ? (
              <WorkspaceAssignUserSelect
                onBlur={assignUserSelectOnBlur}
                onChange={assignUserSelectOnChange}
                assignedUsers={users}
              />
            ) : (
              <Button onClick={assignUserButtonOnClick} className='New-board-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
                <Typography>Assign New User</Typography>
              </Button>
            )}
            {users?.map((user, index) => (
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
      </Box>
    </Box>
  )
}

export default WorkspaceSettings


