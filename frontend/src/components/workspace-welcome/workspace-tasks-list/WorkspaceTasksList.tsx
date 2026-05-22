import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Card,
  Divider,
  Button,
  Box,
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useBoard } from '../../../api/board'
import WorkspaceTask from '../workspace-task/WorkspaceTask'
import WorkspaceTasksListSkeleton from './WorkspaceTasksListSkeleton'


interface Props {
  boardId: number
  workspaceId: string
  listId?: number
  id?: number
}

function WorkspaceTasksList({ boardId, workspaceId }: Props) {
  const navigate = useNavigate()
  const { data: board, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })

  if (isLoading || isError) return (
    <WorkspaceTasksListSkeleton />
  )

  return (
    <div>
      {board?.lists?.length > 0 &&
        <Card sx={{ display: 'flex', flexDirection: 'column', width: '304px', minHeight: '272px', maxHeight: '92%', margin: 3 }}>
          <Button sx={{ textTransform: 'none', display: 'flex', flexDirection: 'row', width: '100%', minHeight: '64px', color: 'black', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}>
            <FontAwesomeIcon style={{ width: '32px', height: '32px' }} icon={faClipboardList} color={board.color} />
            <Typography sx={{ ml: 1.25 }}>
              {board.name}
            </Typography>
          </Button>
          <Divider />
          <div style={{ overflowY: 'auto' }}>
            {board.lists?.map((list) => (
              <div key={list.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, ml: 1 }}>
                  <Typography sx={{ fontSize: '16px' }} variant='overline'>{list.name}</Typography>
                </Box>
                <WorkspaceTask listId={list.id} boardId={board.id} />
              </div>
            ))}
          </div>
        </Card>
      }
    </div>
  )
}

export default WorkspaceTasksList
