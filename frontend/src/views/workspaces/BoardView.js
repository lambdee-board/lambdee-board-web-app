import './BoardView.sass'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'
import { useParams } from 'react-router-dom'

import useBoard from '../../api/useBoard'
import React, { useCallback, useEffect, useState } from 'react'

import update from 'immutability-helper'


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
  const { workspaceId, boardId } = useParams()
  const [sortedTaskLists, setNewTaskListOrder] = useState([])
  const { data: board, isLoading, isError } = useBoard(boardId, { params: { lists: 'visible' } })

  useEffect(() => {
    if ((isLoading || isError) !== true) {
      const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      setNewTaskListOrder([...sortedList])
    }
  }, [isLoading, isError, board])


  const updateListPos = useCallback((dragIndex, hoverIndex) => {
    const updatedList = [...sortedTaskLists]
    if (hoverIndex === 0) {
      updatedList[dragIndex].pos = sortedTaskLists[0].pos / 2
    } else if (hoverIndex === sortedTaskLists.length - 1) {
      updatedList[dragIndex].pos = sortedTaskLists.at(-1).pos + 1024
    } else {
      updatedList[dragIndex].pos = (sortedTaskLists[hoverIndex].pos + sortedTaskLists[hoverIndex + 1].pos) / 2
    }
    setNewTaskListOrder([...updatedList])
  }, [sortedTaskLists])

  const moveList = useCallback((dragIndex, hoverIndex) => {
    updateListPos(dragIndex, hoverIndex)
    setNewTaskListOrder((prevState) => update(prevState,
      { $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevState[dragIndex]],
      ], }))
  },
  [sortedTaskLists])

  const onTaskDrop = {}

  if (isLoading || isError) return (<BoardViewSkeleton />)

  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper' >
          {sortedTaskLists.map((taskList, listIndex) => (
            <TaskList key={taskList.id}
              title={taskList.name}
              pos={taskList.pos}
              id={taskList.id}
              index={listIndex}
              dndFun={[moveList]} />
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
  )
}
