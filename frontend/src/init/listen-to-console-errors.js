import useErrorCounterStore from '../stores/error-counter'

if (process.env.NODE_ENV === 'development') {
  const _warn = console.warn,
    _error = console.error

  console._warn = _warn
  console.warn = function() {
    useErrorCounterStore.getState().addWarning()
    return _warn.apply(console, arguments)
  }

  console._error = _error
  console.error = function() {
    useErrorCounterStore.getState().addError()
    return _error.apply(console, arguments)
  }
}
