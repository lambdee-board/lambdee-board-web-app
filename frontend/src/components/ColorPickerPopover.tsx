import * as React from 'react'
import { Box, Popover, IconButton, Typography } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import {
  faDroplet,

} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  color: string
  onChange: (color: string) => void
  width?: number
  height?: number
}

export default function ColorPickerPopover({ color, onChange }: Props) {
  const [anchorColorPickerPopover, setAnchorColorPickerPopover] = React.useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorColorPickerPopover(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorColorPickerPopover(null)
  }

  const open = Boolean(anchorColorPickerPopover)
  const id = open ? 'ColorPickerPopover' : undefined

  return (
    <Box>
      <IconButton size='small' sx={{ mr: 1 }} onClick={handleClick}>
        <FontAwesomeIcon icon={faDroplet} color={color} style={{ width: '24px', height: '24px' }}  />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorColorPickerPopover}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <HexColorPicker color={color} onChange={onChange} />
        <Typography color={color} sx={{ p: 1 }}>
          {color}
        </Typography>
      </Popover>
    </Box>
  )
}
