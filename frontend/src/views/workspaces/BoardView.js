import './BoardView.sass'
import TaskCard from './../../components/TaskCard'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'

import useTaskLists from '../../api/useTaskLists'
import React from 'react'

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
  const [ sortedTaskLists, setTaskList ] = React.useState([
    { boardId: 1,
      id: 1,
      name: 'asdasdad',
      pos: 123132123123123,
      tasks: [
        {
          id: 2,
          listId: 1,
          name: 'ddddddddddddddddddddddddddddddddddddddd',
          pos: 111111,
        }, {
          id: 2,
          listId: 1,
          name: 'cccccccccccccccccccccccccccccccccccccc',
          pos: 222222,
        },
      ], },
    { boardId: 1,
      id: 2,
      name: 'emerald',
      pos: 987987987987,
      tasks: [
        {
          id: 2,
          listId: 1,
          name: 'aaaaaaaaaaaaaaaaaa',
          pos: 333333,
        }, {
          id: 2,
          listId: 2,
          name: 'bbbbbbbbbbbbbbbbbbbbbbb',
          pos: 4444,
        },
      ] },
  ])

  const { data: taskLists, isLoading, isError } = useTaskLists(1, 'visible')

  // if (!isLoading && !isError) {
  //   const sortedLists = [...taskLists.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
  //   setTaskList(sortedLists)
  // }
  const moveList = (dragIndex, hoverIndex) => {
    console.log(sortedTaskLists)
    const draggedList = sortedTaskLists[dragIndex]
    setTaskList(
      update(sortedTaskLists, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, draggedList]]
      })
    )
  }

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
              moveList={moveList} >
              {taskList.tasks.map((taskListElement, taskIndex) => (
                <TaskCard key = {taskListElement.name}
                  taskLabel = {taskListElement.name}
                  taskTags={taskListElement.tags} // api response missing this prop
                  taskPriority={taskListElement.priority} // api response missing this prop
                  assignedUsers={taskListElement.users}
                  taskPoints={taskListElement.points} // api response missing this prop
                />
              ))}
            </TaskList>
          ))}
          <div className='TaskLists-spacer'></div>
        </div>
      </div>
    </div>
  )
}
