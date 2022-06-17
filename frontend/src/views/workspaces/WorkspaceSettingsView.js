import * as React from 'react'
import {
  Box,
  List,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'

import useWorkspace from '../../api/useWorkspace'
import useWorkspaceUsers  from '../../api/useWorkspaceUsers'
import WorkspaceLabel from '../../components/workspace-settings/WorkspaceLabel'
import NewBoardButton from '../../components/NewBoardButton'
import WorkspaceBoards from '../../components/workspace-settings/WorkspaceBoards'
import WorkspaceUsers from '../../components/workspace-settings/WorkspaceUsers'


import './WorkspaceSettingsView.sass'


const WorkspaceSettings = () => {
  const { workspaceId } = useParams()
  const { data: workspace, mutate, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const { data: users, mutate: mutateUsers } = useWorkspaceUsers(workspaceId)


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
          <NewBoardButton />
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


