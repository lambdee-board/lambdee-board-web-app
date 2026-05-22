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
        <Card sx={{ display: 'flex', flexDirection: 'column', width: '304px', minHeight: '272px', maxHeight: '92%', m: 3 }}>
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
                {list.tasks?.map((task) => (
                  <div key={task.id}>
                    <Button sx={{ textTransform: 'none', display: 'flex', flexDirection: 'row', color: 'black', width: '100%', alignItems: 'flex-start' }} onClick={() => handleOpenTaskCardModal(task)} >
                      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <div>
                          <PriorityIcon size='lg' taskPriority={task.priority} />
                        </div>
                        <Typography noWrap sx={{ ml: 1, mr: 2 }} variant='caption'>{task.name}</Typography>
                        <div style={{ marginLeft: 'auto' }}>
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
