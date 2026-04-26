import * as React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button, Menu } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './DropdownButton.sass'

const DropdownButton = (props) => {
  const open = Boolean(props.anchorEl)

  return (
    <div className='DropdownButton'>
      <Button
        className='Button'
        id='dropdown-button'
        onClick={props.handleClick}
      >
        <Typography variant='button' color='common.white' sx={{ textTransform: 'capitalize' }}>
          {props.label}
          <FontAwesomeIcon className='FontAwesomeIcon' icon={faAngleDown} />
        </Typography>
      </Button>
      <Menu
        sx = {{ mt: 1.7 }}
        anchorEl={props.anchorEl}
        open={open}
        onClose={props.handleClose}
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
  anchorEl: PropTypes.any,
  handleClick: PropTypes.func,
  handleClose: PropTypes.func
}

export default DropdownButton
