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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ListItemIcon } from '@mui/material';


const drawerWidth = 240;

export default function Sidebar() {
  const sidebarText = {'Scripts': 'fa-scroll', 'Settings': 'fa-gear', 'Members':'fa-users'}
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Epic sidebar
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {Object.entries(sidebarText).map(([text, icon], index) => (
              <Box>
                <ListItem button key={text}>
                  {/* <ListItemIcon>
                      <FontAwesomeIcon icon={"fa-solid " + icon} />
                  </ListItemIcon> */}
                  <ListItemText primary={text} />
                </ListItem>
                <Divider />
              </Box>
            ))}
            {['Board', 'Board'].map((text, index) => (
              <Box>
                <ListItem button key={text}>
                  <ListItemIcon className="container">
                      <FontAwesomeIcon icon={["fab", "chalkboard"]} />
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