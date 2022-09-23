import { useParams } from 'react-router-dom'
import React from 'react'

import { useDispatch } from 'react-redux'
import { ReactSortable } from 'react-sortablejs'

import './BoardPlanningView.sass'

import { BoardWorkViewSkeleton } from './BoardView'
import TaskList from '../../../components/board-planning/TaskList'
import apiClient from '../../../api/apiClient'
import useBoard from '../../../api/useBoard'
import { addAlert } from '../../../redux/slices/appAlertSlice'
import { calculateTaskListOrder } from '../../../constants/componentPositionService'

export default function BoardWorkView() {
  const dispatch = useDispatch()
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })

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
    const [updatedElementId, updatedElementPos, reorderedLists] = calculateTaskListOrder(sortedTaskLists, updatedLists)
    if ((updatedElementId ?? true) === true) return

    updateListPos(updatedElementId, updatedElementPos, reorderedLists)
  }

  React.useEffect(() => {
    if (!board) return

    const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskListOrder([...sortedList])
  }, [board])

  if (isLoading || isError) return (<BoardWorkViewSkeleton />)

  return (
    <div className='BoardPlanningView'>
      <div className='TaskLists-scrollable' >
        <ReactSortable
          className='TaskLists-wrapper'
          list={sortedTaskLists}
          setList={updateTaskListOrder}
          scroll
          ghostClass='translucent'
          direction='vertical'
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
