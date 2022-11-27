import React from 'react'
import PropTypes from 'prop-types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { dndListId } from '../utils/dnd'

import TaskList from './TaskList'

export default function SortableTaskList(props) {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: dndListId(props.id),
    data: { type: 'list' }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: active?.data.current.type === 'list' && active?.id === dndListId(props?.id) ? 0 : 1
  }

  return (
    <TaskList
      ref={setNodeRef}
      listDragHandleRef={setActivatorNodeRef}
      style={style}
      dndAttributes={attributes}
      dndListeners={listeners}
      {...props}
    />
  )
}

SortableTaskList.propTypes = {
  id: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}
