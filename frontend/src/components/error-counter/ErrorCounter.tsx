import { Box } from '@mui/material'
import useErrorCounterStore from '../../stores/error-counter'

function ErrorCounter() {
  const errorCount = useErrorCounterStore((store) => store.errors)
  const warningCount = useErrorCounterStore((store) => store.warnings)

  if (process.env.NODE_ENV !== 'development') return
  if (errorCount === 0 && warningCount === 0) return

  return (
    <Box sx={{ fontSize: '.8rem', position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 0)', zIndex: 1500, backgroundColor: 'red', color: 'white', borderRadius: '8px', padding: '1rem 2rem' }}>
      <Box sx={{ marginBottom: '.5rem', fontSize: '1rem' }}>Take a look at the browser console</Box>
      <div>
        <div>Errors: {errorCount}</div>
        <div>Warnings: {warningCount}</div>
      </div>
    </Box>
  )
}

export default ErrorCounter
