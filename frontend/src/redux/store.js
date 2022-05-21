import { configureStore } from '@reduxjs/toolkit'
import errorCounterReducer from './slices/errorCounterSlice'

export default configureStore({
  reducer: {
    errorCounter: errorCounterReducer,
  }
})
