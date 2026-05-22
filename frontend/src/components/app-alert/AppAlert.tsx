import { Alert, AlertTitle } from '@mui/material'
import useAppAlertStore from '../../stores/app-alert'

function AppAlert() {
  const clearAlert = useAppAlertStore((store) => store.clearAlert)
  const clearAlertTimeout = useAppAlertStore((store) => store.clearAlertTimeout)
  const title = useAppAlertStore((store) => store.title)
  const message = useAppAlertStore((store) => store.message)
  const severity = useAppAlertStore((store) => store.severity)

  if (message === null) return

  clearAlertTimeout()

  return (
    <Alert
      variant='filled'
      onClose={() => clearAlert()}
      severity={severity as 'success' | 'info' | 'warning' | 'error' || 'info'}
      sx={{ position: 'absolute', zIndex: 2000, top: 9, left: '50%', transform: 'translate(-50%, 0)' }}>
      {title && <AlertTitle>{title}</AlertTitle> }
      {message}
    </Alert>
  )
}

export default AppAlert
