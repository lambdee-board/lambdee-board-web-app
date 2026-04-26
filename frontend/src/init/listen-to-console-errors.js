import useErrorCounterStore from '../stores/error-counter'

if (process.env.NODE_ENV === 'development') {
  const _warn = console.warn,
    _error = console.error

  console._warn = _warn
  console.warn = function() {
    setTimeout(() => useErrorCounterStore.getState().addWarning(), 0)
    return _warn.apply(console, arguments)
  }

  console._error = _error
  console.error = function() {
    setTimeout(() => useErrorCounterStore.getState().addError(), 0)
    return _error.apply(console, arguments)
  }
}
