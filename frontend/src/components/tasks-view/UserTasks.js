import * as React from 'react'
import PropTypes from 'prop-types'
import {
  IconButton,
  Typography,
  InputBase,
  Card,
  Divider
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import useUserTasks from '../../api/useUserTasks'
import './UserTasks.sass'
import PriorityIcon from '../PriorityIcon'


function UserTasks({ boardId }) {
  const { data: board, isBoardLoading, isBoardError } = useUserTasks({ id: boardId })
  console.log(board)
  return (
    <div>
      {board &&
        <Card className='userTasks-card' >
          <div className='userTasks-card-title'>
            <FontAwesomeIcon className='userTasks-card-title-icon' icon={faClipboardList} color={board.colour} />
            <Typography sx={{ ml: '10px' }}>
              {board.name}
            </Typography>
          </div>
          <Divider />
          <div>
            {board.lists?.map((list) => (
              <div key={list.id} className='userTasks-card-list'>
                <div className='userTasks-card-list-title'>
                  <Typography sx={{ fontSize: '16px' }} variant='overline'>{list.name}</Typography>
                </div>
                {list.tasks?.map((task) => (
                  <div key={task.id}>
                    <div className='userTasks-card-list-task'>
                      <div className='userTasks-card-list-task-priority'>
                        <PriorityIcon size='lg' taskPriority={task.priority} />
                      </div>
                      <div className='userTasks-card-list-task-title'>
                        <Typography variant='caption'>{task.name}</Typography>
                      </div>

                    </div>
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
}

export default UserTasks
