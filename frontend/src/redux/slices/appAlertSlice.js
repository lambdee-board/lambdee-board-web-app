import { createSlice } from '@reduxjs/toolkit'

export const appAlertSlice = createSlice({
  name: 'appAlert',
  initialState: {
    title: null,
    message: null,
    severity: null,
  },
  reducers: {
    addAlert: (state, action) => {
      state.title = action.payload.title || null
      state.message = action.payload.message || null
      state.severity = action.payload.severity || null
    },
    clearAlert: (state) => {
      state.title = null
      state.message = null
      state.severity = null
    },
  },
})

// Actions
export const { addAlert, clearAlert } = appAlertSlice.actions

// Thunks
export const clearAlertTimeout = (timeout = 5000) => (dispatch) => {
  setTimeout(() => {
    dispatch(clearAlert())
  }, timeout)
}

// Selectors
export const selectTitle = (state) => state.appAlert.title
export const selectMessage = (state) => state.appAlert.message
export const selectSeverity = (state) => state.appAlert.severity

// Reducer
export default appAlertSlice.reducer
