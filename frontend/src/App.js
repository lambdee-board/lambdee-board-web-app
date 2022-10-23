import { ThemeProvider } from '@mui/material'

import { Outlet } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { Sortable, MultiDrag, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'

import './App.sass'
import lambdeeTheme from './lambdeeTheme'


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

        <div className='App'>

          <Navbar />
          <div className='App-body'>
            <Outlet />
          </div>
        </div>

      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
