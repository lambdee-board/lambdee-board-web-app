import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  Divider,
  Grid,
} from '@mui/material'

import useWorkspace from '../../../api/workspace'
import WorkspaceTasksList from '../../../components/workspace-welcome/workspace-tasks-list/WorkspaceTasksList'


export default function WorkspaceWelcomeView() {
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })


  if (isLoading || isError) return (
    <></>
  )

  return (
    <Box sx={{ bgcolor: 'primary.light', width: 'calc(100% - 24px)', minHeight: '656px', height: 'calc(100vh - 80px)', m: 1, flexShrink: 0, ml: 2, borderRadius: '8px', display: 'inline-flex', flexDirection: 'column' }}>
      <Box sx={{ height: '100%', minHeight: '320px', overflowX: 'auto', display: 'flex', flexDirection: 'row', pt: 1 }}>
        {workspace.boards?.map((board) => (
          <WorkspaceTasksList key={board.id} workspaceId={workspaceId!} boardId={board.id} />
        ))}
      </Box>
    </Box>
  )
}
