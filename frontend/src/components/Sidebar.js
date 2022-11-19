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
  // Button,
  Skeleton,
} from '@mui/material'
import {
  faClipboardList,
  faScroll,
  faGear,
  faUsers,
  // faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { DeveloperContent } from '../permissions/content/DeveloperContent'
import { ManagerContent } from '../permissions/content/ManagerContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { styled, useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'

import useWorkspace from '../api/workspace'

import './Sidebar.sass'
import WorkspaceIcon from './WorkspaceIcon'
import NewBoardButton from './NewBoardButton'

const drawerWidth = 240

// const SidebarButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: `-${drawerWidth}px`,
//     ...(open && {
//       transition: theme.transitions.create('margin', {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       marginLeft: 0,
//     }),
//   }),
// )

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
  // const theme = useTheme()
  const navigate = useNavigate()
  const { workspaceId, boardId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  // const [isOpen, setOpen] = React.useState(true)

  return (
    <Box className='Sidebar-wrapper'>
      <Drawer
        className='Sidebar'
        variant='persistent'
        open={true}
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
              <DeveloperContent>
                <SidebarListItem
                  active={false}
                  label='Scripts'
                  onClick={() => navigate(`/workspaces/${workspaceId}/scripts`)}
                  icon={<FontAwesomeIcon icon={faScroll} />}
                />
              </DeveloperContent>
              <ManagerContent>
                <SidebarListItem
                  active={false}
                  label='Settings'
                  onClick={() => navigate(`/workspaces/${workspaceId}/settings`)}
                  icon={<FontAwesomeIcon icon={faGear} />}
                />
              </ManagerContent>
              <SidebarListItem
                active={false}
                label='Members'
                onClick={() => navigate(`/workspaces/${workspaceId}/members`)}
                icon={<FontAwesomeIcon icon={faUsers} />}
              />
              {workspace.boards?.map((board, index) => (
                <SidebarListItem
                  className='ListItem-board'
                  key={board.name + index}
                  active={board.id === boardId}
                  label={board.name}
                  onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
                  icon={<FontAwesomeIcon className='ListItem-icon' icon={faClipboardList} color={board.colour} />}
                />
              ))}
            </List>
          )}
          <ManagerContent>
            <NewBoardButton />
          </ManagerContent>
        </Box>
      </Drawer>
      {/* <SidebarButton
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
      </SidebarButton> */}
    </Box>
  )
}

Sidebar.propTypes = {
}
