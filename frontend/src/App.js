import { ThemeProvider } from '@mui/material'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'

import ErrorCounter from './components/ErrorCounter'
import Navbar from './components/Navbar'

import BoardView from './views/BoardView'

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <div className='App'>
        <ErrorCounter />
        <Navbar />
        <BoardView />
      </div>
    </ThemeProvider>
  )
}

export default App
