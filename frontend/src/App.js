import { Box, ThemeProvider } from '@mui/material'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'

import TaskCard from './components/TaskCard'
import ErrorCounter from './components/ErrorCounter'
import TaskList from './components/TaskList'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import TaskTag from './types/TaskTag'

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


const getColor = () => {
  const colors = ['green', 'red', 'orange', 'purple', 'blue']
  return colors[Math.floor(Math.random() * colors.length)]
}

const workspaceName = 'SnippetzDev'
const boardNameColor = [['Board 1', getColor()], ['Board 2', getColor()]]
const activeTab = 'Board 1'

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <Navbar />
        <Sidebar workspaceName={workspaceName} boardNameColor={boardNameColor} activeTab={activeTab} />
        <Box sx={{ pl: 36, display: 'flex', flexDirection: 'row', overflowX: 'auto', height: 950 }} >
          {['Backlog', 'To Do', 'Doing', 'Code Review', 'Done'].map((text, index) => (
            <TaskList key={index} title={text}>
              {taskList.map((taskListElement) => (
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
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
