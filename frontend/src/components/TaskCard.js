import React, { useRef } from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  AvatarGroup,
  Skeleton,
  Modal
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon.js'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'

import './TaskCard.sass'
import TaskCardModal from './TaskCardModal'
import Tag from './Tag'


const TaskCardSkeleton = () => {
  return (
    <div className='TaskCard'>
      <Card className='.MuiCard-root'>
        <Typography>
          <Skeleton height={36} width={200} variant='text' />
        </Typography>
        <Box className='Box-categories'>
          <Skeleton height={24} width={65} variant='rectangular' />
        </Box>
        <Box className='Box'>
          <Box className='Box-priority' />
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            <Skeleton height={24} width={24} variant='circular' />
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}


const TaskCard = (props) => {
  const dndRef = useRef(null)
  const [moveTaskInList, updateTaskPos] = props.dndFun

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.TASKCARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop(item, monitor) {
      if (item.listId === props.parentIndex) {
        updateTaskPos(item.index, props.index)
      }
    },
    hover(item, monitor)  {
      if (!dndRef.current) return

      if (item.listId !== props.parentIndex) {
        item.idxInNewList = props.index
        return
      }

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return

      const hoveredRect = dndRef.current.getBoundingClientRect()
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2
      const mousePosition = monitor.getClientOffset()
      const hoverClientY = mousePosition.y - hoveredRect.top


      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveTaskInList(dragIndex, hoverIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASKCARD,
    item: {
      id: props.id,
      index: props.index,
      listId: props.parentIndex,
      pos: props.pos,
      idxInNewList: 0
    },
    isDragging: (monitor) => (props.id === monitor.getItem().id),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })

  drag(drop(dndRef))

  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => setOpenTaskCardModal(false)

  return (
    <div className='TaskCard' style={{ opacity: isDragging ? 0 : 1 }} >
      <Modal
        open={openTaskCardModal}
        onClose={handleCloseTaskCardModal}
      >
        <Box
          className='TaskList-Modal'
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <TaskCardModal taskId={props.id} />
        </Box>
      </Modal>
      <Card className='.MuiCard-root' ref={dndRef} data-handler-id={handlerId} onClick={handleOpenTaskCardModal}>
        <Typography className='TaskCard-label'>
          {props.taskLabel}
        </Typography>
        <Box className='Box-tags'>
          {props.taskTags.map((tag) => (
            <Tag key={tag.id} name={tag.name} colour={tag.colour} />
          ))}
        </Box>
        <Box className='Box'>
          <Box className='Box-priority'>
            <PriorityIcon taskPriority={props.taskPriority} />
            {props.taskPoints ? <Avatar className='Box-priority-avatar'>{props.taskPoints}</Avatar> : null}
          </Box>
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            {props.assignedUsers.map((assignedUser) => (
              <Avatar key={assignedUser.id} alt={assignedUser.name} src={assignedUser.avatarUrl} />
            ))}
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}

TaskCard.defaultProps = {
  taskLabel: '',
  taskTags: [],
  assignedUsers: [],
}

TaskCard.propTypes = {
  assignedUsers: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  dndFun: PropTypes.array.isRequired,
  parentIndex: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  taskLabel: PropTypes.string.isRequired,
  taskPoints: PropTypes.number,
  taskPriority: PropTypes.string,
  taskTags: PropTypes.array.isRequired,
}

export default TaskCard
export { TaskCard, TaskCardSkeleton }
