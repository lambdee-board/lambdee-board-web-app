import './init/configure-prism'
import './init/initialize-console'

import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import ErrorCounter from './components/error-counter/ErrorCounter'
import AppAlert from './components/app-alert/AppAlert'

import './init/listen-to-console-errors'
import reportWebVitals from './init/report-web-vitals'

import App from './App'
import { ManagerRoutes, DeveloperRoutes, RegularRoutes, PrivateRoutes, PublicRoutes } from './permissions/routes'

import ConsoleView from './views/console-view/ConsoleView'
import ReportsView from './views/workspaces/boards/reports-view/ReportsView'
import WorkspaceView from './views/workspaces/workspace-view/WorkspaceView'
import BoardView from './views/workspaces/boards/BoardView'
import BoardPlanningView from './views/workspaces/boards/board-planning-view/BoardPlanningView'
import BoardWorkView from './views/workspaces/boards/board-work-view/BoardWorkView'
import UserSettingsView from './views/user-settings-view/UserSettingsView'
import WorkspaceSettingsView from './views/workspaces/workspace-settings-view/WorkspaceSettingsView'
import WelcomeView from './views/welcome-view/WelcomeView'
import TasksView from './views/workspaces/tasks-view/TasksView'
import LoginView from './views/login/login-view/LoginView'
import ForgotPasswordView from './views/login/forgot-password-view/ForgotPasswordView'
import PasswordResetView from './views/login/password-reset-view/PasswordResetView'
import ResetPasswordView from './views/login/reset-password-view/ResetPasswordView'
import WorkspaceMembersView from './views/workspaces/workspace-members-view/WorkspaceMembersView'
import WorkspaceScriptsView from './views/workspaces/workspace-scripts-view/WorkspaceScriptsView'
import WorkspaceWelcomeView from './views/workspaces/workspace-welcome-view/WorkspaceWelcomeView'
import EditScriptView from './views/workspaces/scripts/EditScriptView/EditScriptView'
import AllScriptsView from './views/workspaces/scripts/all-scripts-view/AllScriptsView'
import ScriptRunsView from './views/workspaces/scripts/ScriptRunsView'
import ScriptVariablesView from './views/workspaces/scripts/ScriptVariablesView'
import EditScriptCodeView from './views/workspaces/scripts/EditScriptView/EditScriptCodeView'
import EditScriptTriggersView from './views/workspaces/scripts/EditScriptView/EditScriptTriggersView'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppAlert />
    <ErrorCounter />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path='/login' element={<LoginView />} />
          <Route path='/login/forgot-password' element={<ForgotPasswordView />} />
          <Route path='/login/reset-password' element={<ResetPasswordView />} />
          <Route path='/login/password-reset' element={<PasswordResetView />} />
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
              <Route path='scripts/:scriptId' element={<EditScriptView />}>
                <Route path='code' element={<EditScriptCodeView />} />
                <Route path='triggers' element={<EditScriptTriggersView />} />
              </Route>
              <Route path='scripts' element={<WorkspaceScriptsView />} >
                <Route path='all' element={<AllScriptsView />} />
                <Route path='runs' element={<ScriptRunsView />} />
                <Route path='variables' element={<ScriptVariablesView />} />
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
