import { sampleSize } from 'lodash'

import './BoardView.sass'
import TaskCard from './../../components/TaskCard'
import TaskList from './../../components/TaskList'

import TaskTag from './../../types/TaskTag'

const frontendTag = new TaskTag('Frontend', '#FFFFFF', '#33E3FF')
const backendTag = new TaskTag('Backend', '#000000', '#FF3333')

const task = {
  taskLabel: 'Fix login issue',
  taskTags: [frontendTag, backendTag],
  assignedUsers: ['Remy Sharp', 'Sharp Remy', 'Sharper Remy', 'Ramier Sharp', 'Even Sharper Remy', 'Even Ramier Sharp'],
  taskPriority: 'high',
  taskPoints: 1
}
const task2 = {
  taskLabel: 'Not important task',
  taskTags: [frontendTag],
  assignedUsers: ['Remy Sharp', 'Sharp Remy'],
  taskPriority: 'low',
  taskPoints: 5
}
const task3 = {
  taskLabel: 'Create database',
  taskTags: [backendTag],
  taskPoints: 8
}
const task4 = {
  taskLabel: 'Important task',
  taskPriority: 'highest'
}
const task5 = {
  taskLabel: 'New Task'
}


const taskList = [task, task, task, task, task2, task3, task4, task5]

export default function BoardView() {
  return (
    <div className='BoardView'>
      <div className='TaskLists-scrollable' >
        <div className='TaskLists-wrapper'>
          {['Backlog', 'To Do', 'Doing', 'Code Review', 'Done'].map((text, index) => (
            <TaskList key={index} title={text}>
              {sampleSize(taskList, Math.floor(Math.random() * taskList.length)).map((taskListElement) => (
                <TaskCard key = {taskListElement.taskLabel}
                  taskLabel = {taskListElement.taskLabel}
                  taskTags={taskListElement.taskTags}
                  taskPriority={taskListElement.taskPriority}
                  assignedUsers={taskListElement.assignedUsers}
                  taskPoints={taskListElement.taskPoints}
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
