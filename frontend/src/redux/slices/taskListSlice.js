import { createSlice } from '@reduxjs/toolkit'

export const taskListSlice = createSlice({
  name: 'taskListOrder',
  initialState: {
    lists: [],
    status: 'idle',
    error: null
  },
  reducers: {
    listChangeOrder: (state, action) => {
      state.listOrder = [...action.payload]
    }
  }
})

// Actions
export const { setListOrder } = taskListSlice.actions

// Selectors
export const selectListOrder = (state) => state.taskListOrder.listOrder

// Reducer
export default taskListSlice.reducer
