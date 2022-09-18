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
import WorkspaceView from './views/workspaces/WorkspaceView'
import BoardView from './views/workspaces/boards/BoardView'
import BoardPlanningView from './views/workspaces/boards/BoardPlanningView'
import BoardWorkView from './views/workspaces/boards/BoardWorkView'
import UserSettingsView from './views/UserSettingsView'
import WorkspaceSettingsView from './views/workspaces/WorkspaceSettingsView'
import WelcomeView from './views/WelcomeView'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='' element={<WelcomeView />} />
          <Route path='workspaces/:workspaceId' element={<WorkspaceView />}>
            <Route path='settings' element={<WorkspaceSettingsView />} />
            <Route path='boards/:boardId' element={<BoardView />}>
              <Route path='' element={<BoardWorkView />} />
              <Route path='planning' element={<BoardPlanningView />} />
            </Route>
          </Route>
          <Route path='console' element={<ConsoleView />} />
          <Route path='account' element={<UserSettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
