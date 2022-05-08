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
import { styled, useTheme } from '@mui/material/styles'
import WorkspaceIcon from './WorkspaceIcon'

import { faChalkboard, faScroll, faGear, faUsers, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


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

export default function Sidebar() {
  const theme = useTheme()
  const [isOpen, setOpen] = React.useState(true)

  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  const workspaceName = 'SnippetzDev'

  return (
    <Box>
      <Drawer
        variant='persistent'
        open={isOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem divider key={workspaceName}>
              <ListItemIcon>
                <WorkspaceIcon name={workspaceName} size={48} />
              </ListItemIcon>
              <ListItemText primary={workspaceName} primaryTypographyProps={{ fontSize: 24 }} />
            </ListItem>
            {Object.entries({ Scripts: faScroll, Settings: faGear, Members: faUsers }).map(([text, icon], index) => (
              <ListItem button divider key={text}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={icon} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            {['Board', 'Board'].map((text, index) => (
              <ListItem button divider key={text + index}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faChalkboard} color={colors[Math.floor(Math.random() * colors.length)]} />
                </ListItemIcon>
                <ListItemText primary={`${text} ${index + 1}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <SidebarButton variant='contained'
        color='secondary'
        sx={{ position: 'absolute',
          top: theme.mixins.toolbar.minHeight + 16,
          left: drawerWidth,
          minWidth: 0,
          padding: '8px',
          borderRadius: '0px 8px 8px 0px' }}
        onClick={() => setOpen(!isOpen)}
        open={isOpen}
      >
        <FontAwesomeIcon style={{ transform: isOpen ? '' : 'rotate(180deg)', transition: 'transform 150ms ease' }} icon={faArrowLeft} />
      </SidebarButton>
    </Box>
  )
}
