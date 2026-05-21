import { Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import lambdeeLogo from '../../../assets/lambdee-logo.svg'

const LogoButton = () => {
  const navigate = useNavigate()

  return (
    <Button color='inherit' onClick={() => navigate('/')} sx={{ display: { xs: 'none', md: 'flex' }, mr: { xs: 1, sm: 8 } }}>
      <Box
        component='img'
        src={lambdeeLogo}
        sx={{
          height: 40,
          width: 40,
          mr: 2,
          bgcolor: 'primary.dark',
          borderRadius: 2,
          p: 0.25,
        }}
      />
      <Typography
        variant='h6'
        sx={{ textTransform: 'none',
          color: 'common.white' } }
      >
        Lambdee
      </Typography>
    </Button>
  )
}

export default LogoButton
