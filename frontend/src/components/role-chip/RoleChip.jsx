import { Chip } from '@mui/material'
import React from 'react'

import PropTypes from 'prop-types'

import './RoleChip.sass'


export default function RoleChip(props) {
  const [chipState, toggleChipState] = React.useState(false)
  const chipRef = React.useRef()

  const toggleRoleChip = () => {
    if (chipState) chipRef.current.style.opacity = 0.45
    else chipRef.current.style.opacity = 1

    toggleChipState(!chipState)

    props.onClickFunc(props.name)
  }

  return (
    <Chip
      onClick={toggleRoleChip}
      className='RoleChip'
      label={props.name}
      ref={chipRef}
      sx={{ background: props.color,
        opacity: 0.45,
        color: 'white',
        mb: 1,
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
        '&:hover': { background: props.color, opacity: 0.6 } }} />
  )
}

RoleChip.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClickFunc: PropTypes.func.isRequired
}
