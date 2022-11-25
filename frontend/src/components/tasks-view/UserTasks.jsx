import * as React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Card,
  Divider,
  Button,
  Modal,
  Box,
  Skeleton
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useUserTasks, mutateUserTasks } from '../../api/user-tasks'
import PriorityIcon from '../PriorityIcon'
import TaskCardModal from '../TaskCardModal'

import './UserTasks.sass'

function UserTasks({ boardId, workspaceId }) {
  const navigate = useNavigate()
  const { data: board, isLoading, isError } = useUserTasks({ id: boardId })
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState(false)
  const [pickedList, setPickedList] = React.useState(false)

  if (isLoading || isError) return (
    <Card className='userTasks-card' >
      <div className='userTasks-card-title'>
        <Skeleton variant='rectangular' sx={{ display: 'flex', alignSelf: 'center', margin: '4px' }} width={210} height={60} />
      </div>
      <Divider />
      <div className='userTasks-card-lists'>
        <div className='userTasks-card-list'>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
          <div className='userTasks-card-list-task'>
            <div className='userTasks-card-list-task-wrapper'>
              <Skeleton width={270} height={40} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  const handleOpenTaskCardModal = (props) => {
    setPickedTask(props.id)
    setPickedList(props.listId)
    setOpenTaskCardModal(true)
  }
  const handleCloseTaskCardModal = () => {
    mutateUserTasks({ id: boardId })
    setOpenTaskCardModal(false)
  }

  return (
    <div>
      {openTaskCardModal &&
        <Modal
          open={openTaskCardModal}
          onClose={handleCloseTaskCardModal}
        >
          <Box
            sx={{  position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              outline: 0 }}>
            <TaskCardModal taskId={pickedTask} boardId = {boardId} workspaceId={workspaceId} closeModal={handleCloseTaskCardModal} />
          </Box>
        </Modal>
      }
      {board?.lists.length > 0 &&
        <Card className='userTasks-card' >
          <Button sx={{ textTransform: 'none' }} className='userTasks-card-title'
            onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
            icon={<FontAwesomeIcon className='ListItem-icon' icon={faClipboardList} color={board.colour} />}>
            <FontAwesomeIcon className='userTasks-card-title-icon' icon={faClipboardList} color={board.colour} />
            <Typography sx={{ ml: '10px' }}>
              {board.name}
            </Typography>
          </Button>
          <Divider />
          <div className='userTasks-card-lists'>
            {board.lists?.map((list) => (
              <div key={list.id} className='userTasks-card-list'>
                <div className='userTasks-card-list-title'>
                  <Typography sx={{ fontSize: '16px' }} variant='overline'>{list.name}</Typography>
                </div>
                {list.tasks?.map((task) => (
                  <div key={task.id}>
                    <Button sx={{ textTransform: 'none' }} className='userTasks-card-list-task' onClick={() => handleOpenTaskCardModal(task)} >
                      <div className='userTasks-card-list-task-wrapper'>
                        <div className='userTasks-card-list-task-priority'>
                          <PriorityIcon size='lg' taskPriority={task.priority} />
                        </div>

                        <Typography className='userTasks-card-list-task-title' variant='caption'>{task.name}</Typography>
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
  workspaceId: PropTypes.number.isRequired,
  listId: PropTypes.number,
  id: PropTypes.number
}

export default UserTasks
