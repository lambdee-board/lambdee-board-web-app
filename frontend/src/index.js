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
import UserSettingsView from './views/workspaces/UserSettingsView'
import WorkspaceSettingsView from './views/workspaces/WorkspaceSettingsView'
import WelcomeView from './views/workspaces/WelcomeView'
import TasksView from './views/workspaces/TasksView'
import LoginView from './views/workspaces/LoginView.js'
import ForgotPasswordView from './views/workspaces/ForgotPasswordView.js'
import ResetPasswordView from './views/workspaces/ResetPasswordView.js'
import WorkspaceMembersView from './views/workspaces/WorkspaceMembersView'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginView />} />
        <Route path='/forgotPasswordView' element={<ForgotPasswordView />} />
        <Route path='/resetPasswordView' element={<ResetPasswordView />} />
        <Route path='/' element={<App />}>
          <Route path='welcomeView' element={<WelcomeView />} />
          <Route path='workspaces/:workspaceId' element={<WorkspaceView />}>
            <Route path='settings' element={<WorkspaceSettingsView />} />
            <Route path='members' element={<WorkspaceMembersView />} />
            <Route path='boards/:boardId' element={<BoardView />} />
          </Route>
          <Route path='workspaces' element={<WorkspacesView />} />
          <Route path='console' element={<ConsoleView />} />
          <Route path='account' element={<UserSettingsView />} />
          <Route path='tasks' element={<TasksView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
