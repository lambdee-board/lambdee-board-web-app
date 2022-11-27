import React from 'react'
import PropTypes from 'prop-types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { dndTaskId } from '../utils/dnd'

import TaskCardListItem from './TaskCardListItem'

export default function SortableTaskCardListItem(props) {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: dndTaskId(props.id),
    data: {
      type: 'task',
      listId: props.listId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: active?.id === props?.id ? 0 : 1
  }

  return (
    <TaskCardListItem
      ref={setNodeRef}
      style={style}
      dndAttributes={attributes}
      dndListeners={listeners}
      {...props}
    />
  )
}

SortableTaskCardListItem.propTypes = {
  id: PropTypes.number.isRequired,
  listId: PropTypes.number.isRequired,
}
