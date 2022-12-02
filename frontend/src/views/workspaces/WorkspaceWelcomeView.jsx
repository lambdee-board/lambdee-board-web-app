import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  Divider,
  Grid,
  Skeleton
} from '@mui/material'

import useWorkspace from './../../api/workspace'
import WorkspaceTasksList from '../../components/workspace-welcome/WorkspaceTasksList'

import './WorkspaceWelcomeView.sass'

export default function WorkspaceWelcomeView() {
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })


  if (isLoading || isError) return (
    <></>
  )

  return (
    <div className='tasksView-wrapper'>
      <div className='tasksView-userTasks'>
        {workspace.boards?.map((board) => (
          <WorkspaceTasksList key={board.id} workspaceId={workspaceId} boardId={board.id} />
        ))}
      </div>
    </div>
  )
}
