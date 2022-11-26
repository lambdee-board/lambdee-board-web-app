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

import { useBoard, mutateBoard } from '../../api/board'
import PriorityIcon from '../PriorityIcon'
import TaskCardModal from '../TaskCardModal'

import './WorkspaceTasks.sass'

function WorkspaceTasks({ boardId, workspaceId }) {
  const navigate = useNavigate()
  const { data: board, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState(false)

  if (isLoading || isError) return (
    <Card className='Tasks-card' >
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

  const handleOpenTaskCardModal = (props) => {
    setPickedTask(props.id)
    setOpenTaskCardModal(true)
  }
  const handleCloseTaskCardModal = () => {
    mutateBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
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
      {console.log(board)}
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
                {list.tasks?.map((task) => (
                  <div key={task.id}>
                    <Button sx={{ textTransform: 'none' }} className='Tasks-card-list-task' onClick={() => handleOpenTaskCardModal(task)} >
                      <div className='Tasks-card-list-task-wrapper'>
                        <div className='Tasks-card-list-task-priority'>
                          <PriorityIcon size='lg' taskPriority={task.priority} />
                        </div>

                        <Typography className='Tasks-card-list-task-title' variant='caption'>{task.name}</Typography>
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

WorkspaceTasks.propTypes = {
  boardId: PropTypes.number.isRequired,
  workspaceId: PropTypes.string.isRequired,
  listId: PropTypes.number,
  id: PropTypes.number
}

export default WorkspaceTasks
