import React from 'react'
import { useParams } from 'react-router-dom'

import { ReactSortable } from 'react-sortablejs'

import apiClient from '../../../../api/axios-client'
import useBoard from '../../../../api/board'
import { isManager } from '../../../../internal/permissions'
import { calculatePos, sortByPos } from '../../../../internal/component-position'
import type { List } from '../../../../types'

import TaskList from '../../../../components/task-list/TaskList'
import TaskListSkeleton from '../../../../components/task-list/TaskListSkeleton'


import useAppAlertStore from '../../../../stores/app-alert'

export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState<List[]>([])
  const [draggedListId, setDraggedListId] = React.useState<number | null>(null)
  const clearDraggedListId = () => setDraggedListId(null)
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })

  const updateListPos = (id: number, newPos: number, updatedLists: List[]) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .then(() => {
        mutateBoard((boardData) => ({ ...boardData!, lists: updatedLists }), { revalidate: false })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
        mutateBoard()
      })
  }

  const updateTaskListOrder = (updatedLists: List[]) => {
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

    const sortedList = sortByPos(board.lists!)
    setNewTaskListOrder([...sortedList])
  }, [board])

  if (isLoading || isError) return (
    <div>
      <div style={{ overflowX: 'auto', height: 'calc(100vh - 136px)' }}>
        <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
          {[0, 1, 2].map((index) => (
            <TaskListSkeleton key={index} />
          ))}
          <div style={{ paddingRight: 16 }}></div>
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
      />
    ))

  return (
    <div>
      <div style={{ overflowX: 'auto', height: 'calc(100vh - 136px)' }}>
        {isManager() ?
          <ReactSortable
            onChoose={(event) => setDraggedListId(parseInt((event.item as HTMLElement).dataset.listId!))}
            onEnd={clearDraggedListId}
            style={{ width: 'fit-content', display: 'flex', flexDirection: 'row', marginLeft: 20 }}
            list={sortedTaskLists}
            setList={updateTaskListOrder}
            scroll
            ghostClass='translucent'
            direction='horizontal'
            animation={50}
          >
            {listComponents}
          </ReactSortable> :
          <div style={{ width: 'fit-content', display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
            {listComponents}
          </div>}
      </div>
    </div>
  )
}
