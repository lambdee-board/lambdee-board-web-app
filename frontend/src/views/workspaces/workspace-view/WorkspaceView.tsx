import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from '../../../components/sidebar/Sidebar'

export default function WorkspaceView() {
  return (
    <div>
      <Sidebar />
      <Box sx={{ ml: 29 }}>
        <Outlet />
      </Box>
    </div>
  )
}
