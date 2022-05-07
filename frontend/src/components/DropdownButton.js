import * as React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Menu } from '@mui/material'
import './DropdownButton.css'

const DropdownButton = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div>
      <Button
        sx = {{ mr: 4 }}
        id='dropdown-button'
        onClick={handleClick}
      >
        <Typography variant='button' color='common.white' >{props.label}</Typography>
      </Button>
      <Menu
        sx = {{ mt: 1.5 }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {props.children}
      </Menu>
    </div>
  )
}

DropdownButton.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.object.isRequired,
  ]),
}

export default DropdownButton
