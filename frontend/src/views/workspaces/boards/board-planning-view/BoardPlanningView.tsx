import { useParams } from 'react-router-dom'
import React from 'react'

import {
  Box, Divider, Typography
} from '@mui/material'
import { ReactSortable } from 'react-sortablejs'

import { isManager } from '../../../../internal/permissions'
import apiClient from '../../../../api/axios-client'
import useBoard from '../../../../api/board'
import { calculatePos, sortByPos } from '../../../../internal/component-position'
import type { List } from '../../../../types'

import TaskPlanningList from '../../../../components/board-planning/task-planning-list/TaskPlanningList'
import TaskPlanningListSkeleton from '../../../../components/board-planning/task-planning-list/TaskPlanningListSkeleton'
import { RegularContent } from '../../../../permissions/content'
import useAppAlertStore from '../../../../stores/app-alert'


export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState<List[]>([])
  const [invisibleLists, setInvisibleList] = React.useState<List[]>([])
  const [draggedListId, setDraggedListId] = React.useState<number | null>(null)
  const clearDraggedListId = () => setDraggedListId(null)

  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })

  const visibility = (lists: List[]) => {
    const visible = lists.filter((el) => el.visible === true)
    const invisible = lists.filter((el) => !el.visible === true)
    return [visible, invisible]
  }

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

    const [visible, invisible] = visibility(board.lists!)
    const sortedList = sortByPos(visible)
    setNewTaskListOrder([...sortedList])
    setInvisibleList([...invisible])
  }, [board])

  if (isLoading || isError) return (
    <Box sx={{ mb: 2 }}>
      <div>
        <Box sx={{ width: '98%', display: 'flex', flexDirection: 'column', ml: 2.5 }}>
          {[0, 1, 2, 3, 4].map((index) => (
            <TaskPlanningListSkeleton key={index} />
          ))}
        </Box>
      </div>
    </Box>
  )

  const visibleListComponents =
    sortedTaskLists.map((taskList, listIndex) => (
      <div key={taskList.id} data-list-id={taskList.id}>
        <TaskPlanningList key={taskList.id}
          title={taskList.name}
          pos={taskList.pos}
          id={taskList.id}
          index={listIndex}
          visible={taskList.visible}
        />
      </div>
    ))

  return (
    <Box sx={{ mb: 2 }}>
      <div>
        {isManager() ?
          <ReactSortable
            onChoose={(event) => setDraggedListId(parseInt((event.item as HTMLElement).dataset.listId!))}
            onEnd={clearDraggedListId}
            style={{ width: '98%', display: 'flex', flexDirection: 'column', marginLeft: 20 }}
            list={sortedTaskLists}
            setList={updateTaskListOrder}
            scroll
            ghostClass='translucent'
            direction='horizontal'
            animation={50}
          >
            {visibleListComponents}
          </ReactSortable> :
          <Box sx={{ width: '98%', display: 'flex', flexDirection: 'column', ml: 2.5 }}>
            {visibleListComponents}
          </Box>
        }
        <RegularContent>
          <Divider sx={{ mt: 3, mb: 1 }}><Typography sx={{ opacity: '0.6' }}>Hidden</Typography></Divider>
          <Box sx={{ width: '98%', display: 'flex', flexDirection: 'column', ml: 2.5 }}>
            {invisibleLists.map((taskList, listIndex) => (
              <TaskPlanningList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </Box>
        </RegularContent>
      </div>

    </Box>
  )
}
