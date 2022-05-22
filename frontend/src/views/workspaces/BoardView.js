import './BoardView.sass'
import TaskCard from './../../components/TaskCard'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'
import { useParams } from 'react-router-dom'

import useTaskLists from '../../api/useTaskLists'
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
          {['Backlog', 'To Do', 'Doing', 'Code Review', 'Done'].map((index) => (
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
  const { data: taskLists, isLoading, isError } = useTaskLists(boardId, 'visible')
  const dispatch = useDispatch()

  useEffect(() => {
    if ((isLoading || isError) !== true) {
      const sortedList = [...taskLists.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      setNewTaskListOrder([...sortedList])
    }
  }, [isLoading, isError, taskLists])


  const updateListPos = useCallback((dragIndex, hoverIndex) => {
    const updatedTaskLists = [...sortedTaskLists]
    if (hoverIndex === 0) {
      updatedTaskLists[dragIndex].pos = sortedTaskLists[0].pos / 2
    } else if (hoverIndex === sortedTaskLists.length - 1) {
      updatedTaskLists[dragIndex].pos = sortedTaskLists.at(-1).pos + 1024
    } else {
      updatedTaskLists[dragIndex].pos = (sortedTaskLists[hoverIndex].pos + sortedTaskLists[hoverIndex + 1].pos) / 2
    }
    setNewTaskListOrder([...updatedTaskLists])

    const listId = updatedTaskLists[dragIndex].id
    const newPos = updatedTaskLists[dragIndex].pos

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
    setNewTaskListOrder((prevState) => update(prevState,
      { $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevState[dragIndex]],
      ], }))
  },
  [])


  if (isLoading || isError) return (<BoardViewSkeleton />)

  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper' >
          {sortedTaskLists.map((taskList, listIndex) => (
            <TaskList key={taskList.name}
              title={taskList.name}
              pos={taskList.pos}
              id={taskList.id}
              index={listIndex}
              dndFun={[moveList, updateListPos]} >
              {taskList.tasks.map((taskListElement, taskIndex) => (
                <TaskCard key = {taskListElement.name}
                  taskLabel = {taskListElement.name}
                  taskTags={taskListElement.tags}
                  taskPriority={taskListElement.priority}
                  assignedUsers={taskListElement.users}
                  taskPoints={taskListElement.points}
                />
              ))}
            </TaskList>))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
  )
}
