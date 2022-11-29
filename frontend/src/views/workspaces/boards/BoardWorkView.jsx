import React from 'react'
import { useParams } from 'react-router-dom'

import { ReactSortable } from 'react-sortablejs'

import apiClient from '../../../api/api-client'
import useBoard from '../../../api/board'
import { isManager } from '../../../internal/permissions'
import { calculatePos, sortByPos } from '../../../internal/component-position'

import { TaskList, TaskListSkeleton } from '../../../components/TaskList'

import './BoardWorkView.sass'
import useAppAlertStore from '../../../stores/app-alert'

export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const [draggedListId, setDraggedListId] = React.useState(null)
  const clearDraggedListId = () => setDraggedListId(null)
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })

  const updateListPos = (id, newPos, updatedLists) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .then(() => {
        mutateBoard((boardData) => ({ ...boardData, lists: updatedLists }), { revalidate: false })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
        mutateBoard()
      })
  }

  const updateTaskListOrder = (updatedLists, ...rest) => {
    if (updatedLists.length === sortedTaskLists.length) {
      let listsAreEqual = true
      for (let i = 0; i < sortedTaskLists.length; i++) {
        if (sortedTaskLists[i].id !== updatedLists[i].id) {
          listsAreEqual = false
          break
        }
      }

      if (listsAreEqual) return
    }

    const currentListIndex = updatedLists.findIndex((list) => list.id === draggedListId)

    const reorderedLists = [...updatedLists]
    const newUpdatedList = { ...reorderedLists[currentListIndex] }
    newUpdatedList.pos = calculatePos(currentListIndex, updatedLists)
    reorderedLists[currentListIndex] = newUpdatedList

    if ((newUpdatedList.id ?? true) === true) return

    updateListPos(newUpdatedList.id, newUpdatedList.pos, reorderedLists)
  }

  React.useEffect(() => {
    if (!board) return

    const sortedList = sortByPos(board.lists)
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

  const listComponents =
    sortedTaskLists.map((taskList, listIndex) => (
      <TaskList key={taskList.id}
        title={taskList.name}
        pos={taskList.pos}
        id={taskList.id}
        index={listIndex}
        visible={taskList.visible}
      />
    ))

  return (
    <div className='BoardWorkView'>
      <div className='TaskLists-scrollable' >
        {isManager() ?
          <ReactSortable
            sortableElement
            onChoose={(event) => setDraggedListId(parseInt(event.item.dataset.listId))}
            onEnd={clearDraggedListId}
            className='TaskLists-wrapper'
            list={sortedTaskLists}
            setList={updateTaskListOrder}
            scroll
            ghostClass='translucent'
            direction='horizontal'
            animation={50}
          >
            {listComponents}
          </ReactSortable> :
          <div className='TaskLists-wrapper'>
            {listComponents}
          </div>}
      </div>
    </div>
  )
}
