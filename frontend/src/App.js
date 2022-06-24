import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { Sortable, MultiDrag, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'
import store from './redux/store'

import ErrorCounter from './components/ErrorCounter'
import AppAlert from './components/AppAlert'
import Navbar from './components/Navbar'

Sortable.mount(new MultiDrag(), new AutoScroll())

const swrConfig = {
  refreshInterval: process.env.NODE_ENV === 'development' ? null : 15000,
  revalidateOnFocus: process.env.NODE_ENV !== 'development'
}

function App() {
  return (
    <ThemeProvider theme={lambdeeTheme}>
      <SWRConfig
        value={swrConfig}
      >
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
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
