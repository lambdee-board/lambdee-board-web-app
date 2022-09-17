import * as React from 'react'
import PropTypes from 'prop-types'
import { mutateList } from '../../api/useList'
import {
  Typography,
  Card,
  Divider,
  Button,
  Modal,
  Box
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

import useUserTasks from '../../api/useUserTasks'
import './UserTasks.sass'
import PriorityIcon from '../PriorityIcon'
import TaskCardModal from '../TaskCardModal'

function UserTasks({ boardId, workspaceId }) {
  const navigate = useNavigate()
  const { data: board, isBoardLoading, isBoardError } = useUserTasks({ id: boardId })
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState(false)
  const [pickedList, setPickedList] = React.useState(false)

  const handleOpenTaskCardModal = (props) => {
    setPickedTask(props.id)
    setPickedList(props.listId)
    setOpenTaskCardModal(true)
  }
  const handleCloseTaskCardModal = () => {
    mutateList({ id: pickedList, axiosOptions: { params: { tasks: 'all' } } })
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
            <TaskCardModal taskId={pickedTask} listId={pickedList} closeModal={handleCloseTaskCardModal} />
          </Box>
        </Modal>
      }
      {typeof board !== 'undefined' && board.lists.length > 0 &&
        <Card className='userTasks-card' >
          <Button sx={{ textTransform: 'none' }} className='userTasks-card-title' onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}
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
  workspaceId: PropTypes.number.isRequired
}

export default UserTasks
