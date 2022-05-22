import './BoardView.sass'
import TaskCard from './../../components/TaskCard'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'

import useTaskLists from '../../api/useTaskLists'
import React, { useCallback, useEffect, useState } from 'react'

import update from 'immutability-helper'


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
  const [sortedTaskLists, setNewTaskListOrder] = useState([])
  const { data: taskLists, isLoading, isError } = useTaskLists(1, 'visible')

  useEffect(() => {
    if ((isLoading || isError) !== true) {
      const sortedList = [...taskLists.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
      console.log('useEffect sorting', sortedList)
      setNewTaskListOrder([...sortedList])
    }
  }, [isLoading, isError])


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
    console.log(sortedTaskLists)
  },
  [sortedTaskLists])

  const onTaskDrop = {}


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
              dndFun={[moveList]} >
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
