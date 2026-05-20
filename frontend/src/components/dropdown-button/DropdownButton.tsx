import * as React from 'react'
import { ReactNode } from 'react'
import { Typography, Button, Menu } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './DropdownButton.sass'

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
    <div className='DropdownButton'>
      <Button
        className='Button'
        id='dropdown-button'
        onClick={handleClick}
      >
        <Typography variant='button' color='white' sx={{ textTransform: 'capitalize' }}>
          {label}
          <FontAwesomeIcon className='FontAwesomeIcon' icon={faAngleDown} />
        </Typography>
      </Button>
      <Menu
        sx = {{ mt: 1.7 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </div>
  )
}

export default DropdownButton
