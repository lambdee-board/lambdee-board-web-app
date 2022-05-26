import React from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../constants/draggableItems'
import PropTypes from 'prop-types'

const TaskDropZone = (props) => {
  const [assignTaskToNewList] = props.dndFun

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASKCARD,
    drop: (item, monitor) => {
      if (item.listId !== props.listId) {
        console.log(item.idxInNewList)
        assignTaskToNewList(item, props.listId)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })


  return (
    <div ref={drop} style={{ minHeight: 20, backgroundColor: isOver ? 'yellow' : 'inherit' }}>
      {props.children}
    </div>
  )
}

TaskDropZone.propTypes = {
  children: PropTypes.array.isRequired,
  dndFun: PropTypes.array.isRequired,
  listId: PropTypes.number.isRequired,
}

export default TaskDropZone
