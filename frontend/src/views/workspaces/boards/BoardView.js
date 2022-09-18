import { Outlet, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import './BoardView.sass'
import useBoard from '../../../api/useBoard'
import BoardToolbar from '../../../components/BoardToolbar'
import { TaskListSkeleton } from '../../../components/TaskList'

function BoardWorkViewSkeleton() {
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

  useEffect(() => {
    if (!board) return

    const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskListOrder([...sortedList])
  }, [board])

  if (isLoading || isError) return (<BoardWorkViewSkeleton />)

  return (
    <div className='BoardView'>
      <BoardToolbar />
      <Outlet context={[board, mutateBoard, sortedTaskLists, setNewTaskListOrder]} />
    </div>
  )
}
