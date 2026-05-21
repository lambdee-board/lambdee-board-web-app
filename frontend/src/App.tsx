import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material'

import { Outlet, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { Sortable, MultiDrag, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'

import './App.sass'
import lambdeeTheme from './lambdee-theme'
import { setNavigate } from './api/navigation'

import Navbar from './components/navbar/Navbar'

Sortable.mount(new MultiDrag(), new AutoScroll())

const swrConfig = {
  refreshInterval: process.env.NODE_ENV === 'development' ? undefined : 3000,
  revalidateOnFocus: process.env.NODE_ENV !== 'development'
}

function App() {
  const navigate = useNavigate()
  useEffect(() => { setNavigate(navigate) }, [navigate])

  return (
    <ThemeProvider theme={lambdeeTheme}>
      <SWRConfig value={swrConfig}>
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
