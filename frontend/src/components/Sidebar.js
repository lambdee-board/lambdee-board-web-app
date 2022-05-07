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
import WorkspaceIcon from './WorkspaceIcon'

import { faChalkboard, faScroll, faGear, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const drawerWidth = 240

export default function Sidebar() {
  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  const workspaceName = 'SnippetzDev'


  return (
    <Box>
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
      <Button variant='contained' color='secondary' sx={{ position: 'absolute',
        top: (theme) => theme.mixins.toolbar.minHeight + 16,
        left: drawerWidth,
        minWidth: 0,
        padding: '8px',
        borderRadius: '0px 8px 8px 0px' }} >
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
    </Box>
  )
}
