import * as React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Menu } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './DropdownButton.sass'

const DropdownButton = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event) => setAnchorEl(event.currentTarget)

  return (
    <div className='DropdownButton'>
      <Button
        className='Button'
        id='dropdown-button'
        onClick={handleClick}
      >
        <Typography variant='button' color='common.white' sx={{ textTransform: 'capitalize' }}>
          {props.label}
          <FontAwesomeIcon className='FontAwesomeIcon' icon={faAngleDown} />
        </Typography>
      </Button>
      <Menu
        sx = {{ mt: 1.7 }}
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
