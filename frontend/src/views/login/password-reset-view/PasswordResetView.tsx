import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  Typography,
  Link,
} from '@mui/material'
import {
  faEnvelopeOpenText
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



import lambdeeLogo from '../../../assets/lambdee-logo.svg'


export default function PasswordResetView() {
  const navigate = useNavigate()
  return (
    <Box sx={{ bgcolor: 'primary.light', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
      <img
        style={{ display: 'flex', width: '64px', height: '64px' }}
        src={lambdeeLogo}
      />
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1, width: '248px', py: 3, px: 1 }}>
        <Typography variant='h5' sx={{ mb: 1 }} color='primary'>Lambdee</Typography>
        <Typography variant='body2'>Reset instructions have been sent!</Typography>
        <FontAwesomeIcon style={{ height: '88px', width: '88px', color: '#1082F3', marginTop: 16, marginBottom: 24 }} icon={faEnvelopeOpenText} />
        <Link onClick={() => navigate('/login')} component='button' sx={{ display: 'flex', alignSelf: 'flex-start', ml: '9%', mb: '6%' }} underline='none' variant='body2'>Back to login</Link>
      </Card>
    </Box>
  )
}
