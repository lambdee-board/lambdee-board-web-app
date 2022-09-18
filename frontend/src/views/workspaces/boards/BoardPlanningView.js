import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { ReactSortable } from 'react-sortablejs'

import './BoardView.sass'
import TaskList, { TaskListSkeleton } from '../../../components/TaskList'
import useBoard from '../../../api/useBoard'
import apiClient from '../../../api/apiClient'
import { addAlert } from '../../../redux/slices/appAlertSlice'
import BoardToolbar from '../../../components/BoardToolbar'
import { calculatePos } from '../../../constants/componentPositionService'


function BoardViewSkeleton() {
  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper'>
          {[0, 1, 2].map((index) => (
            <TaskListSkeleton key={index} />
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
  )
}

export default function BoardView() {
  const { boardId } = useParams()
  const [sortedTaskLists, setNewTaskListOrder] = useState([])
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
  const dispatch = useDispatch()

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

  useEffect(() => {
    if (board) {
      const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      setNewTaskListOrder([...sortedList])
    }
  }, [board])

  if (isLoading || isError) return (<BoardViewSkeleton />)

  return (
    <div className='BoardView'>
      <BoardToolbar />
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
    </div>
  )
}
