import './init/configure-panic-overlay'
import './init/configure-prism'
import './init/initialize-console'

import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import ErrorCounter from './components/ErrorCounter'
import AppAlert from './components/AppAlert'

import './init/listen-to-console-errors'
import reportWebVitals from './init/report-web-vitals'

import App from './App'
import { ManagerRoutes, DeveloperRoutes, RegularRoutes, PrivateRoutes, PublicRoutes } from './permissions/routes'

import ConsoleView from './views/ConsoleView'
import ReportsView from './views/workspaces/boards/ReportsView'
import WorkspaceView from './views/workspaces/WorkspaceView'
import BoardView from './views/workspaces/boards/BoardView'
import BoardPlanningView from './views/workspaces/boards/BoardPlanningView'
import BoardWorkView from './views/workspaces/boards/BoardWorkView'
import UserSettingsView from './views/UserSettingsView'
import WorkspaceSettingsView from './views/workspaces/WorkspaceSettingsView'
import WelcomeView from './views/WelcomeView'
import TasksView from './views/workspaces/TasksView'
import LoginView from './views/login/LoginView'
import ForgotPasswordView from './views/login/ForgotPasswordView'
import ResetPasswordView from './views/login/ResetPasswordView'
import WorkspaceMembersView from './views/workspaces/WorkspaceMembersView'
import WorkspaceScriptsView from './views/workspaces/WorkspaceScriptsView'
import WorkspaceWelcomeView from './views/workspaces/WorkspaceWelcomeView'
import EditScriptView from './views/workspaces/scripts/EditScriptView'
import AllScriptsView from './views/workspaces/scripts/AllScriptsView'
import ScriptRunsView from './views/workspaces/scripts/ScriptRunsView'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppAlert />
    <ErrorCounter />
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<LoginView />} />
          <Route path='/login/forgot-password' element={<ForgotPasswordView />} />
          <Route path='/login/reset-password' element={<ResetPasswordView />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<App />}>
            <Route path='' element={<WelcomeView />} />
            <Route path='workspaces/:workspaceId' element={<WorkspaceView />}>
              <Route path='' element={<WorkspaceWelcomeView />} />
              <Route element={<ManagerRoutes />}>
                <Route path='settings' element={<WorkspaceSettingsView />} />
              </Route>
              <Route path='boards/:boardId' element={<BoardView />}>
                <Route path='reports' element={<ReportsView />} />
                <Route path='work' element={<BoardWorkView />} />
                <Route path='planning' element={<BoardPlanningView />} />
              </Route>
              <Route path='members' element={<WorkspaceMembersView />} />
              <Route path='scripts/:scriptId' element={<EditScriptView />} />
              <Route path='scripts' element={<WorkspaceScriptsView />} >
                <Route path='all' element={<AllScriptsView />} />
                <Route path='runs' element={<ScriptRunsView />} />
              </Route>
            </Route>
            <Route path='members' element={<WorkspaceMembersView />} />
            <Route element={<DeveloperRoutes />}>
              <Route path='console' element={<ConsoleView />} />
            </Route>
            <Route path='account' element={<UserSettingsView />} />
            <Route element={<RegularRoutes />}>
              <Route path='tasks' element={<TasksView />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
