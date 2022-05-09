import { ThemeProvider } from '@mui/material'

import './App.sass'
import TaskCard from './components/TaskCard'
import lambdeeTheme from './lambdeeTheme'
import ErrorCounter from './components/ErrorCounter'

const categories = [['Frontend', '#FFFFFF', '#33E3FF'], ['Backend', '#000000', '#FF3333']]
const users = ['Remy Sharp', 'Sharp Remy', 'Sharper Remy', 'Ramier Sharp', 'Even Sharper Remy', 'Even Ramier Sharp']
const label = 'Fix login issue'
function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <TaskCard
          label = {label}
          categories={categories}
          priority='high'
          users={users}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
