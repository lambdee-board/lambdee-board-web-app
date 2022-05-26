import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SWRConfig } from 'swr'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'
import store from './redux/store'

import ErrorCounter from './components/ErrorCounter'
import AppAlert from './components/AppAlert'
import Navbar from './components/Navbar'

const swrConfig = {
  refreshInterval: process.env.NODE_ENV === 'development' ? null : 15000,
  revalidateOnFocus: true
}

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <SWRConfig
        value={swrConfig}
      >
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
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
