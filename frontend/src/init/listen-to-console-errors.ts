import useErrorCounterStore from '../stores/error-counter'

if (process.env.NODE_ENV === 'development') {
  const _warn = console.warn,
    _error = console.error

  ;(console as unknown as Record<string, unknown>)._warn = _warn
  console.warn = function(...args: unknown[]) {
    setTimeout(() => useErrorCounterStore.getState().addWarning(), 0)
    return _warn.apply(console, args as Parameters<typeof console.warn>)
  }

  ;(console as unknown as Record<string, unknown>)._error = _error
  console.error = function(...args: unknown[]) {
    setTimeout(() => useErrorCounterStore.getState().addError(), 0)
    return _error.apply(console, args as Parameters<typeof console.error>)
  }
}
