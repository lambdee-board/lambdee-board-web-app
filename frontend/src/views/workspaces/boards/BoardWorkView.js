import React from 'react'
import { useParams } from 'react-router-dom'

import { ReactSortable } from 'react-sortablejs'

import apiClient from '../../../api/apiClient'
import useBoard from '../../../api/useBoard'
import { isManager } from '../../../permissions/ManagerContent'
import { calculateTaskListOrder } from '../../../constants/componentPositionService'

import { TaskList, TaskListSkeleton } from '../../../components/TaskList'

import './BoardWorkView.sass'
import useAppAlertStore from '../../../stores/app-alert'

export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })

  const updateListPos = (id, newPos, updatedLists) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
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

  if (isLoading || isError) return (
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

  return (
    <div className='BoardWorkView'>
      <div className='TaskLists-scrollable' >
        {isManager() ?
          <ReactSortable
            sortableElement
            className='TaskLists-wrapper'
            list={sortedTaskLists}
            setList={updateTaskListOrder}
            scroll
            ghostClass='translucent'
            direction='horizontal'
            delay={1}
            animation={50}
          >
            {sortedTaskLists.map((taskList, listIndex) => (
              <TaskList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </ReactSortable> :
          <div className='TaskLists-wrapper'>
            {sortedTaskLists.map((taskList, listIndex) => (
              <TaskList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </div>}
      </div>
    </div>
  )
}
