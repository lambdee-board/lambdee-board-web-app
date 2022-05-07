const sidebarReducer = (state = { open: true }, action) => {
  switch (action.type) {
  case 'OPEN':
    return { ...state, open: true }
  case 'CLOSE':
    return { ...state, open: false }
  default:
    return state
  }
}
export default sidebarReducer
