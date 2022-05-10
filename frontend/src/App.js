import { ThemeProvider } from '@mui/material'

import './App.sass'
import TaskCard from './components/TaskCard'
import lambdeeTheme from './lambdeeTheme'
import ErrorCounter from './components/ErrorCounter'

const task = {
  taskLabel: 'Fix login issue',
  taskCategories: [['Frontend', '#FFFFFF', '#33E3FF'], ['Backend', '#000000', '#FF3333']],
  assignedUsers: ['Remy Sharp', 'Sharp Remy', 'Sharper Remy', 'Ramier Sharp', 'Even Sharper Remy', 'Even Ramier Sharp'],
  taskPriority: 'high',
  taskPoints: 1
}
const task2 = {
  taskLabel: 'Not important task',
  taskCategories: [['Frontend', '#FFFFFF', '#33E3FF']],
  assignedUsers: ['Remy Sharp', 'Sharp Remy'],
  taskPriority: 'low',
  taskPoints: 5
}
const task3 = {
  taskLabel: 'Create database',
  taskCategories: [['Backend', '#000000', '#FF3333']],
  taskPoints: 8

}
const task4 = {
  taskLabel: 'Important task',
  taskPriority: 'very high'
}
const task5 = {
  taskLabel: 'New Task'
}


const taskList = [task, task2, task3, task4, task5]

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        {taskList.map((taskListElement) => (
          <TaskCard key = {taskListElement.taskLabel}
            taskLabel = {taskListElement.taskLabel}
            taskCategories={taskListElement.taskCategories}
            taskPriority={taskListElement.taskPriority}
            assignedUsers={taskListElement.assignedUsers}
            taskPoints={taskListElement.taskPoints}
          />
        ))}
      </div>
    </ThemeProvider>
  )
}

export default App
