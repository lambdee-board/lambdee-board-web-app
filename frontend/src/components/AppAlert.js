import './AppAlert.sass'

import { Alert, AlertTitle } from '@mui/material'
import useAppAlertStore from '../stores/app-alert'

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
      className='AppAlert'
      onClose={() => clearAlert()}
      severity={severity || 'info'}>
      {title && <AlertTitle>{title}</AlertTitle> }
      {message}
    </Alert>
  )
}

export default AppAlert
