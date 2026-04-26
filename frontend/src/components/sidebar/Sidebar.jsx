import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  faClipboardList,
  faGear,
  faUsers,
  faGem,
} from '@fortawesome/free-solid-svg-icons'
import { DeveloperContent } from '../../permissions/content/DeveloperContent'
import { ManagerContent } from '../../permissions/content/ManagerContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import useWorkspace from '../../api/workspace'

import './Sidebar.sass'
import WorkspaceIcon from '../WorkspaceIcon'
import NewBoardButton from '../NewBoardButton'
import ScriptButton from '../ScriptButton'
import SidebarSkeleton from './SidebarSkeleton'

const drawerWidth = 240

function SidebarListItem(props) {
  return (
    <ListItem onClick={props.onClick} className={props.className} id={ props.active ? 'active' : ''} button divider >
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.label} />
    </ListItem>
  )
}

SidebarListItem.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { workspaceId, boardId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  if (!localStorage.getItem('sidebarSelected')) {
    localStorage.setItem('sidebarSelected', 'workspace')
  }

  return (
    <Box className='Sidebar-wrapper'>
      <Drawer
        className='Sidebar'
        variant='persistent'
        open={true}
        sx={{ ['& .MuiDrawer-paper']: { width: drawerWidth, boxSizing: 'border-box' } }} >
        <Toolbar />
        <Box className='List-wrapper'>

          {isLoading || isError ? (
            <SidebarSkeleton />
          ) : (
            <List className='List'>
              <SidebarListItem
                active={localStorage.getItem('sidebarSelected') === 'workspace'}
                onClick={() => {
                  localStorage.setItem('sidebarSelected', 'workspace')
                  navigate(`/workspaces/${workspaceId}`)
                }}
                className='ListItem-workspace'
                label={workspace.name}
                icon={<WorkspaceIcon name={workspace.name} size={48} />}
              />
              <ManagerContent>
                <SidebarListItem
                  active={localStorage.getItem('sidebarSelected') === 'Settings'}
                  label='Settings'
                  onClick={() => {
                    localStorage.setItem('sidebarSelected', 'Settings')
                    navigate(`/workspaces/${workspaceId}/settings`)
                  }}
                  icon={<FontAwesomeIcon icon={faGear} />}
                />
              </ManagerContent>
              <DeveloperContent>
                <SidebarListItem
                  active={localStorage.getItem('sidebarSelected') === 'Scripts'}
                  label='Scripts'
                  onClick={() => {
                    localStorage.setItem('sidebarSelected', 'Scripts')
                    navigate(`/workspaces/${workspaceId}/scripts`)
                  }}
                  icon={<FontAwesomeIcon icon={faGem} />}
                />
              </DeveloperContent>
              <SidebarListItem
                active={localStorage.getItem('sidebarSelected') === 'Members'}
                label='Members'
                onClick={() => {
                  localStorage.setItem('sidebarSelected', 'Members')
                  navigate(`/workspaces/${workspaceId}/members`)
                }}
                icon={<FontAwesomeIcon icon={faUsers} />}
              />
              {workspace.boards?.map((board, index) => (
                <SidebarListItem
                  className='ListItem-board'
                  key={board.name + index}
                  active={localStorage.getItem('sidebarSelected') === board.name}
                  label={board.name}
                  onClick={() => {
                    localStorage.setItem('sidebarSelected', board.name)
                    navigate(`/workspaces/${workspaceId}/boards/${board.id}`)
                  }}
                  icon={<FontAwesomeIcon className='ListItem-icon' icon={faClipboardList} color={board.colour} />}
                />
              ))}
            </List>
          )}
          <DeveloperContent>
            <Box sx={{ mt: '10px', display: 'flex', justifyContent: 'center' }}>
              <ScriptButton scope='workspaces' id={workspaceId} />
            </Box>
          </DeveloperContent>
          <ManagerContent>
            <NewBoardButton />
          </ManagerContent>

        </Box>
      </Drawer>
    </Box>
  )
}

Sidebar.propTypes = {
}
