import React from 'react'
import {
  Card,
  Typography,
  Divider,
  Grid,
  Link
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'

import apiClient from '../../api/apiClient'
import useCurrentUser from '../../api/useCurrentUser'
import WorkspaceIcon from '../../components/WorkspaceIcon'
import useWorkspaces from '../../api/useWorkspaces'
import { addAlert } from '../../redux/slices/appAlertSlice'
import './TasksView.sass'
import UserTasks from '../../components/tasks-view/UserTasks'


export default function TasksView() {
  const { data: workspaces, isLoading, isError } = useWorkspaces({ axiosOptions: { params: { boards: 'visible' } } })
  const [pickedWorkspace, setWorkspaceId] = React.useState(false)


  if (isLoading || isError) return (
    <div></div>
  )

  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-workspaces'>
        {workspaces.map((workspace) => (
          <Link component='button' underline='none' key={workspace.id} sx={{ transform: 'none' }} onClick={() => setWorkspaceId(workspace)}>
            <Card className='tasksView-workspaces-card' >
              <div className='tasksView-workspaces-card-title'>
                <WorkspaceIcon name={workspace.name} size={52} />
                <Typography sx={{ ml: '10px' }}>
                  {workspace.name}
                </Typography>
              </div>
              <Divider />
              <Grid sx={{ mt: '4px' }} container spacing={2} direction='row'
                alignItems='center' >
                {workspace.boards?.slice(0, 9).map((board) => (
                  <Grid item xs={4} key={board.id} className='tasksView-workspaces-card-board'>
                    <FontAwesomeIcon icon={faClipboardList} color={board.colour} />
                    <Typography variant='caption'>{board.name}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Link>
        ))}
      </div>
      <Divider />
      {pickedWorkspace &&
        <div>
          {pickedWorkspace.boards?.map((board) => (
            <UserTasks key={board.id} boardId={board.id} />
          ))}
        </div>


      }
    </div>
  )
}
