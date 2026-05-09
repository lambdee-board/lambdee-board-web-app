import * as React from 'react'
import { useParams } from 'react-router-dom'
import {
  Typography,
  Button,
  Modal,
  Box,
} from '@mui/material'

import { useList, mutateList } from '../../../api/list'
import PriorityIcon from '../../priority-icon/PriorityIcon'
import TaskCardModal from '../../task-card-modal/TaskCardModal'
import TaskDueTime from '../../TaskDueTime'
import WorkspaceTaskSkeleton from './WorkspaceTaskSkeleton'

import './WorkspaceTask.sass'

interface Props {
  boardId: number
  listId?: number
  id?: number
}

function WorkspaceTask({ listId, boardId }: Props) {
  const { workspaceId } = useParams()
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState<number | false>(false)
  const { data: taskList, isLoading, isError } = useList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })

  if (isLoading || isError) return (
    <WorkspaceTaskSkeleton />
  )

  const handleOpenTaskCardModal = (props: { id: number }) => {
    setOpenTaskCardModal(true)
    setPickedTask(props.id)
  }
  const handleCloseTaskCardModal = () => {
    mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
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
      {taskList.tasks?.map((task) => (
        <div key={task.id}>
          <Button sx={{ textTransform: 'none', color: 'black' }} className='Tasks-card-list-task' onClick={() => handleOpenTaskCardModal(task)} >
            <div className='Tasks-card-list-task-wrapper'>
              <div className='Tasks-card-list-task-priority'>
                <PriorityIcon size='lg' taskPriority={task.priority} />
              </div>

              <Typography noWrap className='Tasks-card-list-task-title' variant='caption'>{task.name}</Typography>
              <div className='Tasks-card-list-task-duetime'>
                {task.dueTime && <TaskDueTime dueTime={task.dueTime} format={'MM/DD/YY'} />}
              </div>
            </div>
          </Button>
        </div>
      ))}
    </div>
  )
}


export default WorkspaceTask
