import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Card,
  Divider,
  Button
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

import useUserTasks from '../../api/useUserTasks'
import './UserTasks.sass'
import PriorityIcon from '../PriorityIcon'


function UserTasks({ boardId, workspaceId }) {
  const navigate = useNavigate()
  const { data: board, isBoardLoading, isBoardError } = useUserTasks({ id: boardId })
  return (
    <div>
      {board &&
        <Card className='userTasks-card' >
          <Button sx={{ textTransform: 'none' }} className='userTasks-card-title' onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
            icon={<FontAwesomeIcon className='ListItem-icon' icon={faClipboardList} color={board.colour} />}>
            <FontAwesomeIcon className='userTasks-card-title-icon' icon={faClipboardList} color={board.colour} />
            <Typography sx={{ ml: '10px' }}>
              {board.name}
            </Typography>
          </Button>
          <Divider />
          <div>
            {board.lists?.map((list) => (
              <div key={list.id} className='userTasks-card-list'>
                <div className='userTasks-card-list-title'>
                  <Typography sx={{ fontSize: '16px' }} variant='overline'>{list.name}</Typography>
                </div>
                {list.tasks?.map((task) => (
                  <div key={task.id}>
                    <Button sx={{ textTransform: 'none' }} className='userTasks-card-list-task'>
                      <div className='userTasks-card-list-task-priority'>
                        <PriorityIcon size='lg' taskPriority={task.priority} />
                      </div>
                      <div className='userTasks-card-list-task-title'>
                        <Typography variant='caption'>{task.name}</Typography>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      }
    </div>
  )
}

UserTasks.propTypes = {
  boardId: PropTypes.number.isRequired,
  workspaceId: PropTypes.number.isRequired
}

export default UserTasks
