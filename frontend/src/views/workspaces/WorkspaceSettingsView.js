import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Divider,
  Avatar
} from '@mui/material'
import {
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import useWorkspace from '../../api/useWorkspace'
import useWorkspaceUsers  from '../../api/useWorkspaceUsers'
import NewBoardButton from '../../components/NewBoardButton'
import './WorkspaceSettingsView.sass'


function BoardListItem(props) {
  return (
    <Box>
      <ListItem>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.label} />
      </ListItem>
      <Divider />
    </Box>
  )
}
function UserListItem(props) {
  return (
    <Box>
      <ListItem>
        <Avatar src={props.icon} />
        <ListItemText primary={props.label} />
      </ListItem>
      <Divider />
    </Box>
  )
}

const WorkspaceSettings = () => {
  const { workspaceId } = useParams()
  const { data: workspace, mutate, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const { data: users, isUsersLoading, isUsersError } = useWorkspaceUsers(workspaceId)

  return (

    <Box className='WorkspaceSettings-wrapper'>
      <NewBoardButton />
      {isLoading || isError ? (
        <Box></Box>
      ) : (
        <List>
          {workspace.boards?.map((board, index) => (
            <BoardListItem
              key={board.name + index}
              label={board.name}
              icon={<FontAwesomeIcon icon={faClipboardList} color={board.colour} />}
            />
          ))}
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


