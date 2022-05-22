import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { Outlet, Link } from 'react-router-dom'

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
        <div className='App'>
          <AppAlert />
          <ErrorCounter />
          <Navbar />
          <div className='App-body'>
            <Outlet />
          </div>
        </div>
      </Provider>
    </ThemeProvider>
  )
}

export default App
