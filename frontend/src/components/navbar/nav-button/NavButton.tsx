import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface NavButtonProps {
  label: string
  path: string
}

const NavButton = ({ label, path }: NavButtonProps) => {
  const navigate = useNavigate()

  return (
    <Button color='inherit' sx={{ mr: { xs: 1, sm: 4 } }} onClick={() => navigate(path)}>
      <Typography variant='button' sx={{ textTransform: 'capitalize', color: 'common.white' }}>
        {label}
      </Typography>
    </Button>
  )
}

export default NavButton
