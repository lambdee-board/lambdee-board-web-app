import * as React from 'react'
import { ReactNode } from 'react'
import { Typography, Button, Menu, Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

interface Props {
  label: string
  children: ReactNode
  anchorEl?: HTMLElement | null
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void
  handleClose?: () => void
}

const DropdownButton = ({ label, children, anchorEl, handleClick, handleClose }: Props) => {
  const open = Boolean(anchorEl)

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{ mr: { xs: 1, sm: 4 } }}
      >
        <Typography variant='button' sx={{ textTransform: 'capitalize', color: 'common.white', mr: 0.5 }}>
          {label}
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'inline' }, color: 'common.white' }}>
          <FontAwesomeIcon className='FontAwesomeIcon' icon={faAngleDown} />
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </Box>
  )
}

export default DropdownButton
