import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  List,
  ListItem,
  ListItemText,

  ListItemIcon,
  ClickAwayListener,
  Divider,
  InputBase,
  Avatar,
  IconButton
} from '@mui/material'
import {
  faClipboardList,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import { addAlert } from '../../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import useWorkspace from '../../api/useWorkspace'
import useWorkspaceUsers  from '../../api/useWorkspaceUsers'
import NewBoardButton from '../../components/NewBoardButton'
import BoardListItem from '../../components/workspace-settings/BoardListItem'
import WorkspaceIcon from '../../components/WorkspaceIcon'
import ColorPickerPopover from '../../components/ColorPickerPopover'
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
          {/* <BoardListItem className='ListItem-workspace'
            label={workspace.name}
            icon={<WorkspaceIcon name={workspace.name} size={48} />}
          /> */}
          <NewBoardButton />
          {workspace.boards?.map((board) => (
            <BoardListItem
              key={board.id}
              boardId={board.id}
              boardName={board.name}
              boardColor={board.colour}
              workspace={workspace}
              mutate={mutate}
              icon={<FontAwesomeIcon className='BoardListItem-icon' icon={faClipboardList} color={board.colour} />}
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


BoardListItem.propTypes = {
  icon: PropTypes.object.isRequired,
  boardId: PropTypes.number,
  boardName: PropTypes.string.isRequired,
  boardColor: PropTypes.string,
  workspace: PropTypes.object,
  mutate: PropTypes.func
}

UserListItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
