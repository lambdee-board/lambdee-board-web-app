import { Chip } from '@mui/material'
import React from 'react'

import './RoleChip.sass'

interface Props {
  name: string
  color: string
  onClickFunc: (name: string) => void
}

export default function RoleChip({ name, color, onClickFunc }: Props) {
  const [chipState, toggleChipState] = React.useState(false)
  const chipRef = React.useRef<HTMLDivElement>(null)

  const toggleRoleChip = () => {
    if (chipState) chipRef.current!.style.opacity = '0.45'
    else chipRef.current!.style.opacity = '1'

    toggleChipState(!chipState)

    onClickFunc(name)
  }

  return (
    <Chip
      onClick={toggleRoleChip}
      className='RoleChip'
      label={name}
      ref={chipRef}
      sx={{ background: color,
        opacity: 0.45,
        color: 'white',
        mb: 1,
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
        '&:hover': { background: color, opacity: 0.6 } }} />
  )
}
