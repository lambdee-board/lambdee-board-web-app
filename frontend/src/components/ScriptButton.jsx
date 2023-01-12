import { Button, IconButton } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

import { faScroll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ScriptButton.sass'


export default function ScriptButton({ variant }) {
  if (variant === 'default') {
    return (
      <Button sx={{ ml: '6%' }}
        className='ScriptButton'
        color='secondary'
        variant='outlined'
        startIcon={<FontAwesomeIcon icon={faScroll} />}>
              Scripts
      </Button>
    )
  }
  if (variant === 'icon') {
    return (
      <IconButton color='secondary'>
        <FontAwesomeIcon icon={faScroll} />
      </IconButton>
    )
  }
}

ScriptButton.defaultProps = {
  variant: 'default'
}

ScriptButton.propTypes = {
  variant: PropTypes.string.isRequired,
}

