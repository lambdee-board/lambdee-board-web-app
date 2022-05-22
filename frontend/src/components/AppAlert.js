import './AppAlert.sass'

import { useSelector, useDispatch } from 'react-redux'
import { Alert, AlertTitle } from '@mui/material'

import {
  clearAlert,
  clearAlertTimeout,
  selectMessage,
  selectTitle,
  selectSeverity,
} from './../redux/slices/appAlertSlice'

function AppAlert() {
  const dispatch = useDispatch()
  const title = useSelector(selectTitle)
  const message = useSelector(selectMessage)
  const severity = useSelector(selectSeverity)


  if (message === null) return

  dispatch(clearAlertTimeout())

  return (
    <Alert
      variant='filled'
      className='AppAlert'
      onClose={() => dispatch(clearAlert())}
      severity={severity || 'info'}>
      {title && <AlertTitle>{title}</AlertTitle> }
      {message}
    </Alert>
  )
}

export default AppAlert
