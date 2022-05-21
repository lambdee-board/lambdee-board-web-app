import { configureStore } from '@reduxjs/toolkit'
import errorCounterReducer from './slices/errorCounterSlice'
import taskListSliceReducer from './slices/taskListSlice'

export default configureStore({
  reducer: {
    errorCounter: errorCounterReducer,
    taskListOrder: taskListSliceReducer
  }
})
