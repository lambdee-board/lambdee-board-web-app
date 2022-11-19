import { Outlet } from 'react-router-dom'
import React from 'react'

import BoardToolbar from '../../../components/BoardToolbar'


export default function BoardView() {
  return (
    <div className='BoardView'>
      <BoardToolbar />
      <Outlet />
    </div>
  )
}
