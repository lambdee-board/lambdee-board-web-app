
import { useParams } from 'react-router-dom'
import { Box, Toolbar, List } from '@mui/material'
import {
  faClipboardList,
  faGear,
  faUsers,
  faGem,
} from '@fortawesome/free-solid-svg-icons'
import { DeveloperContent } from '../../permissions/content/DeveloperContent'
import { ManagerContent } from '../../permissions/content/ManagerContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useWorkspace from '../../api/workspace'
import WorkspaceIcon from '../WorkspaceIcon'
import NewBoardButton from '../new-board-button/NewBoardButton'
import ScriptButton from '../script-button/ScriptButton'
import SidebarSkeleton from './SidebarSkeleton'
import SidebarListItem from './SidebarListItem'

export default function Sidebar() {
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })

  return (
    <Box className='Sidebar-wrapper'>
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxSizing: 'border-box',
          zIndex: 'drawer',
        }}
      >
        <Toolbar />
        <Box className='List-wrapper'>
          {isLoading || isError ? (
            <SidebarSkeleton />
          ) : (
            <List className='List'>
              <SidebarListItem
                to={`/workspaces/${workspaceId}`}
                end
                className='ListItem-workspace'
                label={workspace.name}
                icon={<WorkspaceIcon name={workspace.name} size={48} />}
              />
              <ManagerContent>
                <SidebarListItem
                  to={`/workspaces/${workspaceId}/settings`}
                  label='Settings'
                  icon={<FontAwesomeIcon icon={faGear} />}
                />
              </ManagerContent>
              <DeveloperContent>
                <SidebarListItem
                  to={`/workspaces/${workspaceId}/scripts`}
                  label='Scripts'
                  icon={<FontAwesomeIcon icon={faGem} />}
                />
              </DeveloperContent>
              <SidebarListItem
                to={`/workspaces/${workspaceId}/members`}
                label='Members'
                icon={<FontAwesomeIcon icon={faUsers} />}
              />
              {workspace.boards?.map((board) => (
                <SidebarListItem
                  className='ListItem-board'
                  key={board.id}
                  to={`/workspaces/${workspaceId}/boards/${board.id}`}
                  label={board.name}
                  icon={<FontAwesomeIcon icon={faClipboardList} color={board.color} />}
                />
              ))}
            </List>
          )}
          <DeveloperContent>
            <Box sx={{ mt: 1.25, display: 'flex', justifyContent: 'center' }}>
              <ScriptButton scope='workspaces' id={workspaceId!} />
            </Box>
          </DeveloperContent>
          <ManagerContent>
            <NewBoardButton />
          </ManagerContent>
        </Box>
      </Box>
    </Box>
  )
}
