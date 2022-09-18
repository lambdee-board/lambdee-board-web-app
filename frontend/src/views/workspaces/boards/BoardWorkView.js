import { useOutletContext } from 'react-router-dom'
import React from 'react'

import { useDispatch } from 'react-redux'
import { ReactSortable } from 'react-sortablejs'

import './BoardView.sass'
import TaskList from '../../../components/TaskList'
import apiClient from '../../../api/apiClient'
import { addAlert } from '../../../redux/slices/appAlertSlice'
import { calculatePos } from '../../../constants/componentPositionService'


export default function BoardWorkView() {
  const dispatch = useDispatch()
  const [board, mutateBoard, sortedTaskLists, setNewTaskListOrder] = useOutletContext()

  const updateListPos = (id, newPos, updatedLists) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
      .finally(() => {
        mutateBoard((boardData) => ({ ...boardData, lists: updatedLists }))
      })
  }

  const updateTaskListOrder = (updatedLists, ...rest) => {
    let listsAreEqual = true
    for (let i = 0; i < sortedTaskLists.length; i++) {
      if (sortedTaskLists[i].id !== updatedLists[i].id) {
        listsAreEqual = false
        break
      }
    }

    if (listsAreEqual) return

    const currentListIndex = updatedLists.findIndex((list) => list.chosen !== undefined)

    const newUpdatedLists = [...updatedLists]
    const newUpdatedList = { ...newUpdatedLists[currentListIndex] }
    newUpdatedList.pos = calculatePos(currentListIndex, updatedLists)
    newUpdatedLists[currentListIndex] = newUpdatedList

    updateListPos(newUpdatedList.id, newUpdatedList.pos, newUpdatedLists)
  }

  return (
    <div className='TaskLists-scrollable' >
      <ReactSortable
        className='TaskLists-wrapper'
        list={sortedTaskLists}
        setList={updateTaskListOrder}
        scroll
        ghostClass='translucent'
        direction='horizontal'
        multiDrag
        delay={1}
        animation={50}
      >
        {sortedTaskLists.map((taskList, listIndex) => (
          <TaskList key={taskList.id}
            title={taskList.name}
            pos={taskList.pos}
            id={taskList.id}
            index={listIndex}
          />
        ))}
        <div className='TaskLists-spacer'></div>
      </ReactSortable>
    </div>
  )
}
