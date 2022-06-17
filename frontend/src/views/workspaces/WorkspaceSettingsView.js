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
import WorkspaceLabel from '../../components/workspace-settings/WorkspaceLabel'
import NewBoardButton from '../../components/NewBoardButton'
import WorkspaceBoards from '../../components/workspace-settings/WorkspaceBoards'
import WorkspaceUsers from '../../components/workspace-settings/WorkspaceUsers'
import WorkspaceAssignUserSelect from '../../components/workspace-settings/WorkspaceAssignUserSelect'
import UserInfo from '../../components/task-card-modal/UserInfo'


import './WorkspaceSettingsView.sass'


const WorkspaceSettings = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { data: workspace, mutate, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const { data: users, mutate: mutateUsers } = useWorkspaceUsers(workspaceId)
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
        mutateUsers()
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  return (

    <Box className='WorkspaceSettings-wrapper'>

      {isLoading || isError ? (
        <Box></Box>
      ) : (
        <List className='List'>
          <WorkspaceLabel
            workspace={workspace}
            mutate={mutate}
          />
          <NewBoardButton />
          <Box className='WorkspaceBoards'>
            {workspace.boards?.map((board) => (
              <WorkspaceBoards
                key={board.id}
                boardId={board.id}
                boardName={board.name}
                boardColor={board.colour}
                workspace={workspace}
                mutate={mutate}
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
            <WorkspaceUsers
              key={user.name + index}
              userId={user.id}
              userName={user.name}
              userTitle={user.role}
              userAvatarUrl={user.avatarUrl}
              mutate={mutateUsers}
            />
          ))}
        </List>

      )}
    </Box>
  )
}

export default WorkspaceSettings


