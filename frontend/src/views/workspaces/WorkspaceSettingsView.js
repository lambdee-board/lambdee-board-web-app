import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material'
import {
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'

import useWorkspace from '../../api/useWorkspace'
import useWorkspaceUsers  from '../../api/useWorkspaceUsers'
import WorkspaceLabel from '../../components/workspace-settings/WorkspaceLabel'
import NewBoardButton from '../../components/NewBoardButton'
import WorkspaceBoards from '../../components/workspace-settings/WorkspaceBoards'


import './WorkspaceSettingsView.sass'

function UserListItem(props) {
  return (
    <Box>
      <ListItem>
        <Avatar src={props.icon} />
        <ListItemText primary={props.label} />
      </ListItem>
    </Box>
  )
}

const WorkspaceSettings = () => {
  const { workspaceId } = useParams()
  const { data: workspace, mutate, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const { data: users } = useWorkspaceUsers(workspaceId)


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
          <NewBoardButton />
          {users?.map((user, index) => (
            <UserListItem
              key={user.name + index}
              label={user.name}
              icon={user.avatarUrl}
            />
          ))}
        </List>

      )}
    </Box>
  )
}

export default WorkspaceSettings


UserListItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
