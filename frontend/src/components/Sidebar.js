import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChalkboard, faScroll, faGear, faUsers, faBars} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconButton, ListItemIcon } from '@mui/material';
import Jdenticon from 'react-jdenticon';

import style from './Sidebar.css'



const drawerWidth = 240;

export default function Sidebar() {
  const { isOpen, toggleSidebar } = React.useState(true)
  const sidebarText = {'Scripts': faScroll, 'Settings': faGear, 'Members': faUsers}
  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  library.add(faChalkboard,faScroll, faGear, faUsers, faBars)
  const workspace = 'SnippetzDev'


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'row'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => toggleSidebar(!isOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
        </IconButton>
        </Toolbar>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Epic sidebar
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={isOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <Box>
              <ListItem button key={workspace}>
                <ListItemIcon>
                  <Jdenticon size="48" value={workspace} />
                </ListItemIcon>
                <ListItemText primary={workspace} primaryTypographyProps={{fontSize: 24}}/>
              </ListItem>
              <Divider />
            </Box>
            {Object.entries(sidebarText).map(([text, icon], index) => (
              <Box>
                <ListItem button key={text}>
                  <ListItemIcon>
                      <FontAwesomeIcon icon={icon} />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
                <Divider />
              </Box>
            ))}
            {['Board', 'Board'].map((text, index) => (
              <Box>
                <ListItem button key={text}>
                  <ListItemIcon>
                      <FontAwesomeIcon icon={faChalkboard} color={colors[Math.floor(Math.random() * colors.length)]}/>
                  </ListItemIcon>
                  <ListItemText primary={text + " " + (index + 1)} />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>



      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
        </Typography>
      </Box>
    </Box>
  );
}