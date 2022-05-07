import store from '../redux/store'
import { addError, addWarning } from '../redux/slices/errorCounterSlice'

if (process.env.NODE_ENV === 'development') {
  const _warn = console.warn,
    _error = console.error

  console.warn = function() {
    store.dispatch(addWarning())
    return _warn.apply(console, arguments)
  }

  console.error = function() {
    store.dispatch(addError())
    return _error.apply(console, arguments)
  }
}
