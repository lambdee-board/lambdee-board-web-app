import * as React from 'react'
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import WorkspaceIcon from './WorkspaceIcon'

import { faChalkboard, faScroll, faGear, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const drawerWidth = 240

export default function Sidebar() {
  const sidebarText = { Scripts: faScroll, Settings: faGear, Members: faUsers }
  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  const workspaceName = 'SnippetzDev'


  return (
    <Drawer
      variant='persistent'
      open={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <Box key={workspaceName}>
            <ListItem button>
              <ListItemIcon>
                <WorkspaceIcon name={workspaceName} size={48} />
              </ListItemIcon>
              <ListItemText primary={workspaceName} sx={{ fontSize: 24 }} />
            </ListItem>
            <Divider />
          </Box>
          {Object.entries(sidebarText).map(([text, icon], index) => (
            <Box key={text}>
              <ListItem button>
                <ListItemIcon>
                  <FontAwesomeIcon icon={icon} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
              <Divider />
            </Box>
          ))}
          {['Board', 'Board'].map((text, index) => (
            <Box key={text + index}>
              <ListItem button>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faChalkboard} color={colors[Math.floor(Math.random() * colors.length)]} />
                </ListItemIcon>
                <ListItemText primary={`${text} ${index + 1}`} />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
