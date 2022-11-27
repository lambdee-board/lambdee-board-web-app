import React from 'react'
import { useParams } from 'react-router-dom'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'

import apiClient from '../../../api/api-client'
import useBoard from '../../../api/board'
import { isManager } from '../../../internal/permissions'
import { calculateTaskListOrder } from '../../../internal/component-position-service'

import { TaskList, TaskListSkeleton } from '../../../components/TaskList'
import SortableTaskList from '../../../components/SortableTaskList'

import './BoardWorkView.sass'
import useAppAlertStore from '../../../stores/app-alert'

export default function BoardWorkView() {
  const [draggedList, setDraggedList] = React.useState(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
  const listDragSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateListPos = (id, newPos, updatedLists) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
      .finally(() => {
        mutateBoard((boardData) => ({ ...boardData, lists: updatedLists }))
      })
  }

  const updateTaskListOrder = (updatedLists, updatedElementIndex) => {
    const [updatedElementId, updatedElementPos, reorderedLists] = calculateTaskListOrder(updatedLists, updatedElementIndex)
    if ((updatedElementId ?? true) === true) return

    updateListPos(updatedElementId, updatedElementPos, reorderedLists)
  }

  function onListDragStart(event) {
    const { active } = event
    const id = active.id
    const activeList = sortedTaskLists.find((list) => list.id === id)
    setDraggedList(activeList)
  }

  function onListDragEnd(event) {
    const { active, over } = event
    console.log(active, over)
    const draggedId = active?.id
    const overId = over?.id
    if (overId == null || draggedId == null) return

    if (draggedId !== overId) {
      const oldIndex = sortedTaskLists.findIndex((list) => list.id === draggedId)
      const newIndex = sortedTaskLists.findIndex((list) => list.id === overId)
      const updatedLists = arrayMove(sortedTaskLists, oldIndex, newIndex)
      updateTaskListOrder(updatedLists, newIndex)
    }

    setDraggedList(null)
  }

  React.useEffect(() => {
    if (!board) return

    const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskListOrder([...sortedList])
  }, [board])

  if (isLoading || isError) return (
    <div className='BoardView'>
      <div className='BoardWorkView'>
        <div className='TaskLists-scrollable' >
          <div className='TaskLists-wrapper'>
            {[0, 1, 2].map((index) => (
              <TaskListSkeleton key={index} />
            ))}
            <div className='TaskLists-spacer'></div>
          </div>
        </div>
      </div>
    </div>
  )

  const TaskListComponent = isManager() ? SortableTaskList : TaskList

  return (
    <DndContext
      sensors={listDragSensors}
      collisionDetection={closestCenter}
      onDragStart={onListDragStart}
      onDragEnd={onListDragEnd}
    >
      <SortableContext
        items={sortedTaskLists.map((list) => list.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className='BoardWorkView'>
          <div className='TaskLists-scrollable' >
            <div className='TaskLists-wrapper'>
              {sortedTaskLists.map((taskList) => (
                <TaskListComponent key={taskList.id}
                  title={taskList.name}
                  pos={taskList.pos}
                  id={taskList.id}
                  visible={taskList.visible}
                />
              ))}
            </div>
          </div>
        </div>
        <DragOverlay>
          {draggedList ? <TaskList key={draggedList.id}
            title={draggedList.name}
            pos={draggedList.pos}
            id={draggedList.id}
            visible={draggedList.visible}
            dragged={true}
          /> : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}
