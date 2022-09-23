import { Outlet } from 'react-router-dom'
import React from 'react'

import BoardToolbar from '../../../components/BoardToolbar'
import { TaskListSkeleton } from '../../../components/TaskList'

export function BoardWorkViewSkeleton() {
  return (
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
}

export default function BoardView() {
  return (
    <div className='BoardView'>
      <BoardToolbar />
      <Outlet />
    </div>
  )
}
