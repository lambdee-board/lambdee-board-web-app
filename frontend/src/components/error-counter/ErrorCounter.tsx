import useErrorCounterStore from '../../stores/error-counter'

function ErrorCounter() {
  const errorCount = useErrorCounterStore((store) => store.errors)
  const warningCount = useErrorCounterStore((store) => store.warnings)

  if (process.env.NODE_ENV !== 'development') return
  if (errorCount === 0 && warningCount === 0) return

  return (
    <div style={{ fontSize: '.8rem', position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 0)', zIndex: 1500, backgroundColor: 'red', color: 'white', borderRadius: '8px', padding: '1rem 2rem' }}>
      <div style={{ marginBottom: '.5rem', fontSize: '1rem' }}>Take a look at the browser console</div>
      <div>
        <div>Errors: {errorCount}</div>
        <div>Warnings: {warningCount}</div>
      </div>
    </div>
  )
}

export default ErrorCounter
