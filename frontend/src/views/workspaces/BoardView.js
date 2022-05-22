import './BoardView.sass'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'
import { useParams } from 'react-router-dom'

import useBoard from '../../api/useBoard'
import React, { useCallback, useEffect, useState } from 'react'

import update from 'immutability-helper'
import apiClient from '../../api/apiClient'
import { useDispatch } from 'react-redux'
import { addAlert } from '../../redux/slices/appAlertSlice'


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
  const { data: board, isLoading, isError } = useBoard(boardId, { params: { lists: 'visible' } })
  const dispatch = useDispatch()

  useEffect(() => {
    if (board) {
      const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      setNewTaskListOrder([...sortedList])
    }
  }, [board])


  const updateListPos = useCallback((dragIndex, hoverIndex) => {
    const listId = sortedTaskLists[dragIndex].id
    const newPos = sortedTaskLists[dragIndex].pos

    const updatedList = {
      id: listId,
      pos: newPos,
    }
    apiClient.put(`/api/lists/${listId}`, updatedList)
      .then((response) => {})
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }, [dispatch, sortedTaskLists])

  const moveList = useCallback((dragIndex, hoverIndex) => {
    setNewTaskListOrder((prevState) => {
      const newState = update(prevState,
        { $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevState[dragIndex]],
        ], })

      if (hoverIndex === 0) {
        newState[hoverIndex].pos = newState[1].pos / 2
      } else if (hoverIndex === newState.length - 1) {
        newState[hoverIndex].pos = newState.at(-2).pos + 1024
      } else {
        newState[hoverIndex].pos = (newState[hoverIndex - 1].pos + newState[hoverIndex + 1].pos) / 2
      }
      return newState
    })
  },
  [])

  if (isLoading || isError) return (<BoardViewSkeleton />)

  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper' >
          {sortedTaskLists.map((taskList, listIndex) => (
            <TaskList key={`${taskList.name}-${taskList.id}`}
              title={taskList.name}
              pos={taskList.pos}
              id={taskList.id}
              index={listIndex}
              dndFun={[moveList, updateListPos]} />
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
  )
}
