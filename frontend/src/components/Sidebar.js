import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Skeleton,
  InputBase,
  IconButton,
  Typography,
  Card
} from '@mui/material'
import {
  faClipboardList,
  faScroll,
  faGear,
  faUsers,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled, useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import WorkspaceIcon from './WorkspaceIcon'
import useWorkspace from '../api/useWorkspace'

import './Sidebar.sass'


const drawerWidth = 240

const SidebarButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
)

function SidebarListItem(props) {
  return (
    <ListItem onClick={props.onClick} className={props.className} id={ props.active ? 'active' : ''} button divider >
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.label} />
    </ListItem>
  )
}

SidebarListItem.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
}

function SidebarListSkeleton() {
  return (
    <List className='List List-skeleton'>
      <ListItem className='ListItem-workspace' button divider>
        <Skeleton height={46} width={46} variant='rectangular' />
        <Skeleton height={36} width={100} variant='text' />
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
      <ListItem className='ListItem' button divider>
        <div className='ListItem-skeleton-wrapper'>
          <Skeleton height={32} width={32} variant='rectangular' />
          <Skeleton height={24} width={80} variant='text' />
        </div>
      </ListItem>
    </List>
  )
}

export default function Sidebar() {
  const [newBoardButtonVisible, setNewBoardButtonVisible] = React.useState(true)
  const toggleNewBoardButton = () => setNewBoardButtonVisible(!newBoardButtonVisible)
  const newBoardInputRef = React.useRef()
  const newBoardButtonOnClick = () => {
    toggleNewBoardButton()
    setTimeout(() => {
      if (!newBoardInputRef.current) return
      const nameInput = newBoardInputRef.current.children[0]
      nameInput.focus()
    }, 25)
  }
  const newBoardNameInputOnKey = (e) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      break
    case 'Escape':
      e.preventDefault()
      toggleNewBoardButton()
      break
    }
  }
  const theme = useTheme()
  const navigate = useNavigate()
  const { workspaceId, boardId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace(workspaceId, { params: { boards: 'visible' } })
  const [isOpen, setOpen] = React.useState(true)

  return (
    <Box className='Sidebar-wrapper'>
      <Drawer
        className='Sidebar'
        variant='persistent'
        open={isOpen}
        sx={{ ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' } }} >
        <Toolbar />
        <Box className='List-wrapper'>

          {isLoading || isError ? (
            <SidebarListSkeleton />
          ) : (
            <List className='List'>
              <SidebarListItem className='ListItem-workspace'
                label={workspace.name}
                icon={<WorkspaceIcon name={workspace.name} size={48} />}
              />
              <SidebarListItem
                active={false}
                label='Scripts'
                icon={<FontAwesomeIcon icon={faScroll} />}
              />
              <SidebarListItem
                active={false}
                label='Settings'
                icon={<FontAwesomeIcon icon={faGear} />}
              />
              <SidebarListItem
                active={false}
                label='Members'
                icon={<FontAwesomeIcon icon={faUsers} />}
              />
              {workspace.boards?.map((board, index) => (
                <SidebarListItem
                  className='ListItem-board'
                  key={board.name + index}
                  active={board.id === boardId}
                  label={board.name}
                  onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
                  icon={<FontAwesomeIcon icon={faClipboardList} color={board.colour} />}
                />
              ))}
            </List>
          )}
          {!newBoardButtonVisible &&
            <Box className='Sidebar-new-board'>
              <InputBase
                ref={newBoardInputRef}
                className='Sidebar-new-board-input'
                fullWidth
                multiline
                placeholder='Board Label'
                onKeyDown={(e) => newBoardNameInputOnKey(e)}
                onBlur={(e) => toggleNewBoardButton()}
              />
              <IconButton className='Sidebar-new-board-cancel' onClick={() => toggleNewBoardButton()}>
                <FontAwesomeIcon className='Sidebar-new-board-cancel-icon' icon={faXmark} />
              </IconButton>
            </Box>
          }
          <Box className='Sidebar-new-board-wrapper'>
            {newBoardButtonVisible &&
            <Button onClick={newBoardButtonOnClick} className='Sidebar-new-board-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Board</Typography>
            </Button>
            }
          </Box>
        </Box>
      </Drawer>
      <SidebarButton
        className='toggle-button'
        variant='contained'
        color='secondary'
        sx={{ top: theme.mixins.toolbar.minHeight + 32, left: drawerWidth, zIndex: theme.zIndex.drawer + 1 }}
        onClick={() => setOpen(!isOpen)}
        open={isOpen} >
        <FontAwesomeIcon
          className={isOpen ? 'opened-icon' : 'closed-icon'}
          icon={faArrowLeft}
        />
      </SidebarButton>
    </Box>
  )
}

Sidebar.propTypes = {
  workspaceName: PropTypes.string.isRequired,
  boardNameColor: PropTypes.array.isRequired,
  activeTab: PropTypes.string.isRequired,
}
