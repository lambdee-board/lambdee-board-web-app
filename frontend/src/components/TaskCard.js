import React, { useRef } from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  AvatarGroup,
  Skeleton
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from './PriorityIcon.js'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'

import './TaskCard.sass'

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
  const [moveTask, updateTaskPos] = props.dndFun

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop(item, monitor) {
      // updateTaskPos(item.index, props.index)
    },
    hover(item, monitor)  {
      if (!dndRef.current) return

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return

      const hoveredRect = dndRef.current?.getBoundingClientRect()
      const hoverMiddleX = (hoveredRect.bottom - hoveredRect.top) / 2
      const mousePosition = monitor.getClientOffset()
      const hoverClientX = mousePosition.y - hoveredRect.top


      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      moveTask(dragIndex, hoverIndex, props.parentIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.TASKLIST,
    item: {
      id: props.id,
      name: props.taskLabel,
      index: props.index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })

  drag(drop(dndRef))

  return (
    <div className='TaskCard'>
      <Card className='.MuiCard-root' ref={dndRef} sx={{ opacity: isDragging ? 0 : 1 }}>
        <Typography>
          {props.taskLabel}
        </Typography>
        <Box className='Box-categories'>
          {props.taskTags.map((taskTag) => (
            <Chip key={taskTag.name} label={taskTag.name} sx={{ color: taskTag.textColor, bgcolor: taskTag.backgroundColor }} size='small' />
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
  index: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  parentIndex: PropTypes.number.isRequired,
  dndFun: PropTypes.array.isRequired,
  taskLabel: PropTypes.string.isRequired,
  taskPriority: PropTypes.string,
  taskTags: PropTypes.array.isRequired,
  assignedUsers: PropTypes.array.isRequired,
  taskPoints: PropTypes.number
}

export default TaskCard
export { TaskCard, TaskCardSkeleton }
