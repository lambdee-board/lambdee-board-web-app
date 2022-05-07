import { ThemeProvider } from '@mui/material'

import './App.css'
import Navbar from './components/Navbar'
import lambdeeTheme from './lambdeeTheme'
import Sidebar from './components/Sidebar'
import ErrorCounter from './components/ErrorCounter'

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <Navbar />
        <Sidebar />
      </div>
    </ThemeProvider>
  )
}

export default App
