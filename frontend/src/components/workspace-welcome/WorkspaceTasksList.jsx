import * as React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Card,
  Divider,
  Button,
  Skeleton
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useBoard } from '../../api/board'
import WorkspaceTask from './WorkspaceTask'

import './WorkspaceTasksList.sass'

function WorkspaceTasksList({ boardId, workspaceId }) {
  const navigate = useNavigate()
  const { data: board, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })

  if (isLoading || isError) return (
    <Card className='Tasks-card'>
      <div className='Tasks-card-title'>
        <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
      </div>
      <Divider />
      <div className='Tasks-card-lists'>
        <div className='Tasks-card-list'>
          <div className='Tasks-card-list-task'>
            <div className='Tasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='Tasks-card-list-task'>
            <div className='Tasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='Tasks-card-list-task'>
            <div className='Tasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )


  return (
    <div>

      {board?.lists?.length > 0 &&
        <Card className='Tasks-card' >
          <Button sx={{ textTransform: 'none' }} className='Tasks-card-title'
            onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
            icon={<FontAwesomeIcon className='ListItem-icon' icon={faClipboardList} color={board.colour} />}>
            <FontAwesomeIcon className='Tasks-card-title-icon' icon={faClipboardList} color={board.colour} />
            <Typography sx={{ ml: '10px' }}>
              {board.name}
            </Typography>
          </Button>
          <Divider />
          <div className='Tasks-card-lists'>
            {board.lists?.map((list) => (
              <div key={list.id} className='Tasks-card-list'>
                <div className='Tasks-card-list-title'>
                  <Typography sx={{ fontSize: '16px' }} variant='overline'>{list.name}</Typography>
                </div>
                <WorkspaceTask listId={list.id} boardId={board.id} />
              </div>
            ))}
          </div>
        </Card>
      }
    </div>
  )
}

WorkspaceTasksList.propTypes = {
  boardId: PropTypes.number.isRequired,
  workspaceId: PropTypes.string.isRequired,
  listId: PropTypes.number,
  id: PropTypes.number
}

export default WorkspaceTasksList
