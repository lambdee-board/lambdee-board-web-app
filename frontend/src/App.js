import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { Outlet, Link } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'
import store from './redux/store'

import ErrorCounter from './components/ErrorCounter'
import AppAlert from './components/AppAlert'
import Navbar from './components/Navbar'

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend} >
          <div className='App'>
            <AppAlert />
            <ErrorCounter />
            <Navbar />
            <div className='App-body'>
              <Outlet />
            </div>
          </div>
        </DndProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
