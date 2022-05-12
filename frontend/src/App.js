import { Box, ThemeProvider } from '@mui/material'

import './App.sass'
import Navbar from './components/Navbar'
import lambdeeTheme from './lambdeeTheme'
import Sidebar from './components/Sidebar'
import ErrorCounter from './components/ErrorCounter'
import TaskList from './components/TaskList'

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <Navbar />
        <Sidebar />
        <Box sx={{ ml: 32, display: 'flex', flexDirection: 'row' }}>
          {['a', 'b', 'c'].map((text, index) => (
            <TaskList key={index} title={`Title ${text}`}>
              {['a', 'b', 'c'].map((text1, index1) => (
                <div key={index1}>Card {index1}</div>
              ))}
            </TaskList>
          ))}
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
