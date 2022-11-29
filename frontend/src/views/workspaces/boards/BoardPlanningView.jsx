import { useParams } from 'react-router-dom'
import React from 'react'

import {
  Divider, Typography
} from '@mui/material'
import { ReactSortable } from 'react-sortablejs'

import { isManager } from '../../../internal/permissions'
import apiClient from '../../../api/api-client'
import useBoard from '../../../api/board'
import { calculatePos, sortByPos } from '../../../internal/component-position'

import { TaskPlanningList, TaskPlanningListSkeleton } from '../../../components/board-planning/TaskPlanningList'
import { RegularContent } from '../../../permissions/content'
import useAppAlertStore from '../../../stores/app-alert'

import './BoardPlanningView.sass'

export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const [invisibleLists, setInvisibleList] = React.useState([])
  const [draggedListId, setDraggedListId] = React.useState(null)
  const clearDraggedListId = () => setDraggedListId(null)

  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })

  const visibility = (lists) => {
    const visible = lists.filter((el) => el.visible === true)
    const invisible = lists.filter((el) => !el.visible === true)
    return [visible, invisible]
  }

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

    const [visible, invisible] = visibility(board.lists)
    const sortedList = sortByPos(visible)
    setNewTaskListOrder([...sortedList])
    setInvisibleList([...invisible])
  }, [board])

  if (isLoading || isError) return (
    <div className='BoardPlanningView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper'>
          {[0, 1, 2, 3, 4].map((index) => (
            <TaskPlanningListSkeleton key={index} />
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
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
    <div className='BoardPlanningView'>
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
            {visibleListComponents}
          </ReactSortable> :
          <div className='TaskLists-wrapper'>
            {visibleListComponents}
          </div>
        }
        <RegularContent>
          <Divider sx={{ mt: '24px', mb: '8px' }}><Typography sx={{ opacity: '0.6' }}>Hidden</Typography></Divider>
          <div className='TaskLists-wrapper'>
            {invisibleLists.map((taskList, listIndex) => (
              <TaskPlanningList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </div>
        </RegularContent>
      </div>

    </div>
  )
}
