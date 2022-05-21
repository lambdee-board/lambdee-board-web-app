import React, { useRef } from 'react'
import {
  List,
  ListItem,
  Paper,
  ListSubheader,
  Typography,
  IconButton,
  Button,
  Skeleton
} from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'
import { TaskCardSkeleton } from './TaskCard'

import './TaskList.sass'

function TaskListSkeleton() {
  return (

    <Box className='TaskList-wrapper'>
      <Paper className='TaskList-paper'
        elevation={5}>
        <List className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Skeleton height={36} width={200} variant='text' />
            <Skeleton height={36} width={36} variant='circular' />
          </ListSubheader>} >
          <ListItem className='TaskList-item' >
            <TaskCardSkeleton />
          </ListItem>
          <ListItem className='TaskList-item' >
            <TaskCardSkeleton />
          </ListItem>
          <ListItem className='TaskList-item' >
            <TaskCardSkeleton />
          </ListItem>
        </List>
        <Box className='TaskList-new-task-wrapper' sx={{ display: 'flex' }}>
          <Skeleton height={36} width={70} variant='text' sx={{ ml: 2, mb: 1 }} />
        </Box>
      </Paper>
    </Box>
  )
}

function TaskList(props) {
  const ref = useRef(null)
  const [moveList] = props.dndFun


  const [{ handlerId }, drop] = useDrop(() => ({
    accept: ItemTypes.TASKLIST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor)  {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) return


      const hoveredRect = ref.current.getBoundingClientRect()
      const hoverMiddleX = (hoveredRect.left - hoveredRect.right) / 2
      const mousePosition = monitor.getClientOffset()
      const hoverClientX = mousePosition.x - hoveredRect.right

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      moveList(dragIndex, hoverIndex)
      // changeListPos(dragIndex, hoverIndex)
      item.index = hoverIndex
      console.log('list moved', item)
    }
  }))

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASKLIST,
    item: {
      id: props.id,
      name: props.title,
      index: props.index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }))

  drag(drop(ref))

  return (
    <Box className='TaskList-wrapper' >
      <Paper className='TaskList-paper' ref={(ref)} sx={{ opacity: isDragging ? 0 : 1 }} data-handler-id={handlerId}
        elevation={5}>
        <List className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Typography className='TaskList-header-text' >
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary'>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          {props.children.map((item, index) => (
            <ListItem className='TaskList-item' key={index} >
              {item}
            </ListItem>
          ))}
        </List>
        <Box className='TaskList-new-task-wrapper'>
          <Button className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>New task</Typography>
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  children: PropTypes.array.isRequired,
  dndFun: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

export default TaskList
export { TaskList, TaskListSkeleton }
