import './BoardView.sass'
import TaskCard from './../../components/TaskCard'
import TaskList, { TaskListSkeleton } from './../../components/TaskList'

import useTaskLists from '../../api/useTaskLists'


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
  const { data: taskLists, isLoading, isError } = useTaskLists(1, 'visible')

  if (isLoading || isError) return (<BoardViewSkeleton />)

  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper'>
          {taskLists.lists.map((taskList) => (
            <TaskList key={taskList.name} title={taskList.name} pos={taskList.pos} >
              {taskList.tasks.map((taskListElement) => (
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
