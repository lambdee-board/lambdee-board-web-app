import { ThemeProvider } from '@mui/material'

import './App.css'
import TaskCard from './components/TaskCard'
import lambdeeTheme from './lambdeeTheme'
import ErrorCounter from './components/ErrorCounter'

const categories = [['Login', '#0000FF', '#FFFFFF.'], ['Login', '#FFFF00', '#000000']]
function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <TaskCard label = 'Fix the login issue' categories={categories} priority='priority' />
      </div>
    </ThemeProvider>
  )
}

export default App
