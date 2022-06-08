import './init/configurePanicOverlay'
import './init/configurePrism'
import './init/initializeConsole'

import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import './init/listenToConsoleErrors'
import reportWebVitals from './init/reportWebVitals'

import App from './App'
import ConsoleView from './views/ConsoleView'
import WorkspacesView from './views/workspaces/WorkspacesView'
import WorkspaceView from './views/workspaces/WorkspaceView'
import BoardView from './views/workspaces/BoardView'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='workspaces/:workspaceId' element={<WorkspaceView />}>
            <Route path='boards/:boardId' element={<BoardView />} />
          </Route>
          <Route path='workspaces' element={<WorkspacesView />} />
          <Route path='console' element={<ConsoleView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
