import { ThemeProvider } from '@mui/material'

import './App.sass'
import TaskCard from './components/TaskCard'
import lambdeeTheme from './lambdeeTheme'
import ErrorCounter from './components/ErrorCounter'

const task = {
  label: 'Fix login issue',
  taskCategories: [['Frontend', '#FFFFFF', '#33E3FF'], ['Backend', '#000000', '#FF3333']],
  assignedUsers: ['Remy Sharp', 'Sharp Remy', 'Sharper Remy', 'Ramier Sharp', 'Even Sharper Remy', 'Even Ramier Sharp'],
  taskPriority: 'high'
}
const task2 = {
  label: 'Not important task',
  taskCategories: [['Frontend', '#FFFFFF', '#33E3FF']],
  assignedUsers: ['Remy Sharp', 'Sharp Remy'],
  taskPriority: 'low'
}
const task3 = {
  label: 'Create database',
  taskCategories: [['Backend', '#000000', '#FF3333']],

}
const task4 = {
  label: 'Important task',
  taskPriority: 'very high'
}
const task5 = {
  label: 'New Task'
}


const taskList = [task, task2, task3, task4, task5]

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        {taskList.map((taskListElement) => (
          <TaskCard key = {taskListElement.label}
            taskLabel = {taskListElement.label}
            taskCategories={taskListElement.taskCategories}
            taskPriority={taskListElement.taskPriority}
            assignedUsers={taskListElement.assignedUsers}
          />
        ))}
      </div>
    </ThemeProvider>
  )
}

export default App
