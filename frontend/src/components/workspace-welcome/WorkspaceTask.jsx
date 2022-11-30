import * as React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import {
  Typography,
  Button,
  Modal,
  Box,
  Skeleton
} from '@mui/material'


import { useList, mutateList } from '../../api/list'
import { mutateBoard } from '../../api/board'
import PriorityIcon from '../PriorityIcon'
import TaskCardModal from '../TaskCardModal'


import './WorkspaceTask.sass'

function WorkspaceTask({ listId, boardId }) {
  const { workspaceId } = useParams()
  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const [pickedTask, setPickedTask] = React.useState(false)
  const { data: taskList, isLoading, isError } = useList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })

  if (isLoading || isError) return (
    <div>
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
  )

  const handleOpenTaskCardModal = (props) => {
    setOpenTaskCardModal(true)
    setPickedTask(props.id)
  }
  const handleCloseTaskCardModal = () => {
    mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
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
      {taskList.tasks?.map((task) => (
        <div key={task.id}>
          <Button sx={{ textTransform: 'none', color: 'black' }} className='Tasks-card-list-task' onClick={() => handleOpenTaskCardModal(task)} >
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
  )
}

WorkspaceTask.propTypes = {
  boardId: PropTypes.number.isRequired,
  listId: PropTypes.number,
  id: PropTypes.number
}

export default WorkspaceTask
