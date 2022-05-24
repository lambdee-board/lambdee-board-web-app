import { configureStore } from '@reduxjs/toolkit'
import errorCounterReducer from './slices/errorCounterSlice'
import appAlertReducer from './slices/appAlertSlice'

export default configureStore({
  reducer: {
    errorCounter: errorCounterReducer,
    appAlert: appAlertReducer,
  }
})
