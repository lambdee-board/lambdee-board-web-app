import * as React from 'react'
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material'
import {
  faChalkboard,
  faScroll,
  faGear,
  faUsers,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled, useTheme } from '@mui/material/styles'
import WorkspaceIcon from './WorkspaceIcon'
import PropTypes from 'prop-types'

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

export default function Sidebar(props) {
  const theme = useTheme()
  const [isOpen, setOpen] = React.useState(true)

  const defaultTabs = [ ['Scripts', faScroll], ['Settings', faGear], ['Members', faUsers] ]

  const getColor = () => {
    const colors = ['green', 'red', 'orange', 'purple', 'blue']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // replace both with swr request after workspace api will be implemented
  const workspaceName = props.workspaceName || 'SnippetzDev'
  const boardNameColor = props.boardNameColor || [['Board 1', getColor()], ['Board 2', getColor()]]
  const activeTab = props.activeTab || 'Board 1'

  return (
    <Box className='Sidebar-wrapper'>
      <Drawer
        className='Sidebar'
        variant='persistent'
        open={isOpen}
        sx={{ ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' } }} >
        <Toolbar />
        <Box className='List-wrapper'>
          <List className='List'>
            <ListItem className='ListItem-workspace' alignItems='center' divider key={workspaceName} >
              <ListItemIcon>
                <WorkspaceIcon name={workspaceName} size={48} />
              </ListItemIcon>
              <ListItemText primary={workspaceName} />
            </ListItem>
            {defaultTabs.map(([tabName, tabIcon], index) => (
              <ListItem id={ activeTab === tabName ? 'active' : ''} button divider key={tabName} >
                <ListItemIcon>
                  <FontAwesomeIcon icon={tabIcon} />
                </ListItemIcon>
                <ListItemText primary={tabName} />
              </ListItem>
            ))}
            {boardNameColor.map(([boardName, color], index) => (
              <ListItem id={ activeTab === boardName ? 'active' : ''} button divider key={boardName + index}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faChalkboard} color={color} />
                </ListItemIcon>
                <ListItemText primary={boardName} />
              </ListItem>
            ))}
          </List>
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
