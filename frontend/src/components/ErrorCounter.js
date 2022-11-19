import useErrorCounterStore from '../stores/error-counter'

import './ErrorCounter.sass'

function ErrorCounter() {
  const errorCount = useErrorCounterStore((store) => store.errors)
  const warningCount = useErrorCounterStore((store) => store.warnings)

  if (process.env.NODE_ENV !== 'development') return
  if (errorCount === 0 && warningCount === 0) return

  return (
    <div className='ErrorCounter'>
      <div className='header'>Take a look at the browser console</div>
      <div>
        <div>Errors: {errorCount}</div>
        <div>Warnings: {warningCount}</div>
      </div>
    </div>
  )
}

export default ErrorCounter
