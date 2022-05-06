import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Icon
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'



const settings = ['Account', 'Logout'];

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [anchorElWorkspaces, setAnchorElWorkspaces] = React.useState(null);
  const [anchorElRecent, setAnchorElRecent] = React.useState(null);
  const [anchorElActions, setAnchorElActions] = React.useState(null);


  const handleClose = () => {
    setAnchorElWorkspaces(null);
    setAnchorElRecent(null);
    setAnchorElActions(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
        <AppBar position="static">
        <Container maxWidth>
            <Toolbar disableGutters>
            <IconButton sx={{ color: 'common.white', display: { xs: 'flex', md: 'flex' }, p: 2, mr: 2 }}>
                <FontAwesomeIcon icon={faBars}  />
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 20, display: { xs: 'none',  md: 'flex' } }}
            >
                Lambdee
            </Typography>
            <Box sx={{flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Button
                id="workspaces-button"
                onClick={e => setAnchorElWorkspaces(e.currentTarget)}
                sx={{mr:4}}
            >
                <Typography variant="button" color="common.white">Workspaces</Typography>
            </Button>
            <Menu
                sx={{ mt: 2 }}
                id="workspaces-menu"
                anchorEl={anchorElWorkspaces}
                open={Boolean(anchorElWorkspaces)}
                onClose={e => setAnchorElWorkspaces()}
            >
                <MenuItem onClick={handleClose}>1</MenuItem>
                <MenuItem onClick={handleClose}>2</MenuItem>
                <MenuItem onClick={handleClose}>3</MenuItem>
            </Menu>
            <Button
                id="recent-button"
                onClick={e => setAnchorElRecent(e.currentTarget)}
                sx={{mr:4}}
            >
                <Typography variant="button" color="common.white">Recent</Typography>
            </Button>
            <Menu
                sx={{ mt: 2 }}
                id="recent-button"
                anchorEl={anchorElRecent}
                open={Boolean(anchorElRecent)}
                onClose={e => setAnchorElRecent()}
            >
                <MenuItem onClick={handleClose}>4</MenuItem>
                <MenuItem onClick={handleClose}>5</MenuItem>
                <MenuItem onClick={handleClose}>6</MenuItem>
            </Menu>
            <Button
                id="actions-button"
                onClick={e => setAnchorElActions(e.currentTarget)}
                sx={{mr:4}}
            >
                <Typography variant="button" color="common.white">Actions</Typography>
            </Button>
            <Menu
                sx={{ mt: 2 }}
                id="actions-button"
                anchorEl={anchorElActions}
                open={Boolean(anchorElActions)}
                onClose={e => setAnchorElActions()}
            >
                <MenuItem onClick={handleClose}>aaaaaaaaaaaaaaaaaaaaa</MenuItem>
                <MenuItem onClick={handleClose}>aaaaaaaaaaaaaaaaaaaaa</MenuItem>
                <MenuItem onClick={handleClose}>aaaaaaaaaaaaaaaaaaaaa</MenuItem>
            </Menu>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Menu
                sx={{ mt: 1.5 }}
                id="user-menu"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
  );
};

export default Navbar;