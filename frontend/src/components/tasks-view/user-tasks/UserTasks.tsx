import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Card,
  Divider,
  Button,
  Modal,
  Box,
} from '@mui/material'
import {
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useUserTasks, mutateUserTasks } from '../../../api/user-tasks'
import PriorityIcon from '../../priority-icon/PriorityIcon'
import TaskCardModal from '../../task-card-modal/TaskCardModal'
import TaskDueTime from '../../TaskDueTime'
import UserTasksSkeleton from './UserTasksSkeleton'

import './UserTasks.sass'

interface Props {
  boardId: number
  workspaceId: number
  listId?: number
  id?: number
}

function UserTasks({ boardId, workspaceId }: Props) {
  const navigate = useNavigate()
  const { data: board, isLoading, isError } = useUserTasks({ id: boardId })
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState<number | false>(false)

  if (isLoading || isError) return (
    <UserTasksSkeleton />
  )

  const handleOpenTaskCardModal = (props: { id: number }) => {
    setPickedTask(props.id)
    setOpenTaskCardModal(true)
  }
  const handleCloseTaskCardModal = () => {
    mutateUserTasks({ id: boardId })
    setOpenTaskCardModal(false)
  }

  return (
    <div>
      {openTaskCardModal && pickedTask !== false &&
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
            <TaskCardModal taskId={pickedTask} boardId={boardId} workspaceId={workspaceId} closeModal={handleCloseTaskCardModal} />
          </Box>
        </Modal>
      }
      {board?.lists.length > 0 &&
        <Card className='userTasks-card' >
          <Button sx={{ textTransform: 'none' }} className='userTasks-card-title'
            onClick={() => navigate(`/workspaces/${workspaceId}/boards/${board.id}`)}>
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

                        <Typography noWrap className='userTasks-card-list-task-title' variant='caption'>{task.name}</Typography>
                        <div className='Tasks-card-list-task-duetime'>
                          {task.dueTime && <TaskDueTime dueTime={task.dueTime} format={'MM/DD/YY'} />}
                        </div>
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

export default UserTasks
