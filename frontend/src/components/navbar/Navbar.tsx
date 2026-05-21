import { AppBar, Box, Toolbar } from '@mui/material'
import { RegularContent, DeveloperContent } from '../../permissions/content'

import AccountMenuButton from '../navbar/account-menu-button/AccountMenuButton'
import WorkspacesMenuButton from '../navbar/workspaces-menu-button/WorkspacesMenuButton'
import RecentMenuButton from '../navbar/recent-menu-button/RecentMenuButton'
import ScriptMenuButton from '../navbar/script-menu-button/ScriptMenuButton'
import LogoButton from '../navbar/logo-button/LogoButton'
import NavButton from '../navbar/nav-button/NavButton'


const Navbar = () => {
  return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <LogoButton />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <WorkspacesMenuButton />
          <RecentMenuButton />
          <RegularContent>
            <ScriptMenuButton />
            <NavButton label='Tasks' path='/tasks' />
          </RegularContent>
          <NavButton label='Members' path='/members' />
          <DeveloperContent>
            <NavButton label='Console' path='/console' />
          </DeveloperContent>
        </Box>
        <AccountMenuButton />
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
