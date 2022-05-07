import { createSlice } from '@reduxjs/toolkit'

export const errorCounterSlice = createSlice({
  name: 'errorCounter',
  initialState: {
    errors: 0,
    warnings: 0
  },
  reducers: {
    addError: (state) => {
      state.errors += 1
    },
    addWarning: (state) => {
      state.warnings += 1
    },
    // this reducer is only an example of how to read values from
    // the `action` object
    addErrors: (state, action) => {
      state.errors += action.payload
    }
  }
})

// Actions
export const { addError, addWarning } = errorCounterSlice.actions

// Selectors
export const selectErrors = (state) => state.errorCounter.errors
export const selectWarnings = (state) => state.errorCounter.warnings

// Reducer
export default errorCounterSlice.reducer
