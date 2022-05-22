import { Box } from '@mui/material'
import React from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'
import PropTypes from 'prop-types'


export default function TaskListDropWrapper(props) {
  const [moveList, onListDrop] = props.dndFun

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes,
    canDrop: (item) => {
      const itemIndex = statuses.findIndex((si) => si.status === item.status)
      const statusIndex = statuses.findIndex((si) => si.status === status)
      return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex)
    },
    drop: (item, monitor) => {
      onListDrop(item, monitor, newListId)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })
  return (
    <Box ref={drop}>
      {React.cloneElement(props.children, { isOver })}
    </Box>
  )
}

TaskListDropWrapper.propTypes = {
  children: PropTypes.array.isRequired,
  dndFun: PropTypes.array.isRequired,
}
