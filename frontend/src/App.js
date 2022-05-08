import { ThemeProvider } from '@mui/material'

import './App.css'
import TaskCard from './components/TaskCard'
import lambdeeTheme from './lambdeeTheme'
import ErrorCounter from './components/ErrorCounter'

const categories = [['Frontend', '#FFFFFF', '#33E3FF'], ['Backend', '#000000', '#FF3333']]
const users = ['Remy Sharp', 'Sharp Remy']
function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <TaskCard
          label = 'Fix the login issue'
          categories={categories}
          priority='priority'
          users={users}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
