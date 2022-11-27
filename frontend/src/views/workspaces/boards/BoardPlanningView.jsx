import { useParams } from 'react-router-dom'
import React from 'react'

import {
  Divider, Typography
} from '@mui/material'

import { isManager } from '../../../internal/permissions'
import apiClient from '../../../api/api-client'
import useBoard from '../../../api/board'
import { calculateTaskListOrder } from '../../../internal/component-position-service'

import { TaskPlanningList, TaskPlanningListSkeleton } from '../../../components/board-planning/TaskPlanningList'
import { RegularContent } from '../../../permissions/content'
import useAppAlertStore from '../../../stores/app-alert'

import './BoardPlanningView.sass'

export default function BoardWorkView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const [invisibleLists, setInvisibleList] = React.useState([])
  const { boardId } = useParams()
  const { data: board, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })

  const Visibility = (lists) => {
    const visible = lists.filter((el) => el.visible === true)
    const invisible = lists.filter((el) => !el.visible === true)
    return [visible, invisible]
  }

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
      })
  }

  const updateTaskListOrder = (updatedLists, ...rest) => {
    const [updatedElementId, updatedElementPos, reorderedLists] = calculateTaskListOrder(sortedTaskLists, updatedLists)
    if ((updatedElementId ?? true) === true) return

    updateListPos(updatedElementId, updatedElementPos, reorderedLists)
  }

  React.useEffect(() => {
    if (!board) return

    const [visible, invisible] = Visibility(board.lists)
    const sortedList = [...visible].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskListOrder([...sortedList])
    setInvisibleList([...invisible])
  }, [board])

  if (isLoading || isError) return (
    <div className='BoardPlanningView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper'>
          {[0, 1, 2, 3, 4].map((index) => (
            <TaskPlanningListSkeleton key={index} />
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>)

  return (
    <div className='BoardPlanningView'>
      <div className='TaskLists-scrollable' >
        {isManager() ?
          // <ReactSortable
          //   sortableElement
          //   className='TaskLists-wrapper'
          //   list={sortedTaskLists}
          //   setList={updateTaskListOrder}
          //   scroll
          //   ghostClass='translucent'
          //   direction='horizontal'
          //   delay={1}
          //   animation={50}
          // >
          <>
            {sortedTaskLists.map((taskList, listIndex) => (
              <TaskPlanningList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </> :
          <div className='TaskLists-wrapper'>
            {sortedTaskLists.map((taskList, listIndex) => (
              <TaskPlanningList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </div>
        }
        <RegularContent>
          <Divider sx={{ mt: '48px' }}><Typography sx={{ opacity: '0.6' }}>Hidden</Typography></Divider>
          <div className='TaskLists-wrapper'>
            {invisibleLists.map((taskList, listIndex) => (
              <TaskPlanningList key={taskList.id}
                title={taskList.name}
                pos={taskList.pos}
                id={taskList.id}
                index={listIndex}
                visible={taskList.visible}
              />
            ))}
          </div>
        </RegularContent>
      </div>

    </div>
  )
}
