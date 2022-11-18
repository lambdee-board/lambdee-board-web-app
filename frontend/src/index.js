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
import store from './redux/store'
import { Provider } from 'react-redux'
import ErrorCounter from './components/ErrorCounter'
import AppAlert from './components/AppAlert'

import './init/listenToConsoleErrors'
import reportWebVitals from './init/reportWebVitals'


import App from './App'
import PrivateRoutes from './routes/PrivateRoutes'
import PublicRoutes from './routes/PublicRoutes'
import RegularRoutes from './routes/RegularRoutes'
import DeveloperRoutes from './routes/DeveloperRoutes'
import ManagerRoutes from './routes/ManagerRoutes'
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
import LoginView from './views/login/LoginView.js'
import ForgotPasswordView from './views/login/ForgotPasswordView.js'
import ResetPasswordView from './views/login/ResetPasswordView.js'
import WorkspaceMembersView from './views/workspaces/WorkspaceMembersView'
import WorkspaceScriptsView from './views/workspaces/WorkspaceScriptsView'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
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
                <Route element={<ManagerRoutes />}>
                  <Route path='settings' element={<WorkspaceSettingsView />} />
                </Route>
                <Route path='boards/:boardId' element={<BoardView />}>
                  <Route path='reports' element={<ReportsView />} />
                  <Route path='work' element={<BoardWorkView />} />
                  <Route path='planning' element={<BoardPlanningView />} />
                </Route>
                <Route path='members' element={<WorkspaceMembersView />} />
                <Route path='scripts' element={<WorkspaceScriptsView />} />
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
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
