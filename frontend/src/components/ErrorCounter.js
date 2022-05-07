import './ErrorCounter.sass'

import { useSelector } from 'react-redux'

import {
  selectErrors,
  selectWarnings
} from './../redux/slices/errorCounterSlice'

function ErrorCounter() {
  const errorCount = useSelector(selectErrors)
  const warningCount = useSelector(selectWarnings)

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
