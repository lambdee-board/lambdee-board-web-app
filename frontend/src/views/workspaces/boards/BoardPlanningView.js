import { useOutletContext } from 'react-router-dom'
import React from 'react'

import { useDispatch } from 'react-redux'

import './BoardPlanningView.sass'
import TaskList from '../../../components/board-planning/TaskList'


export default function BoardPlanningView() {
  const dispatch = useDispatch()
  const [board, mutateBoard, sortedTaskLists, setNewTaskListOrder] = useOutletContext()

  return (
    <div className='BoardPlanningView'>
      <div className='TaskLists-wrapper'>
        {sortedTaskLists.map((list) => (
          <TaskList key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}
