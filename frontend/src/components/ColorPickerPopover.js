import * as React from 'react'
import { Box, Popover, IconButton, Typography } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet } from '@fortawesome/free-solid-svg-icons'


export default function ColorPickerPopover() {
  const [color, setColor] = React.useState('#1082F3')
  const [anchorColorPickerPopover, setAnchorColorPickerPopover] = React.useState(null)

  const handleClick = (event) => {
    setAnchorColorPickerPopover(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorColorPickerPopover(null)
  }

  const open = Boolean(anchorColorPickerPopover)
  const id = open ? 'ColorPickerPopover' : undefined

  return (
    <Box>
      <IconButton size='small' color='primary' sx={{ mr: 2 }} onClick={handleClick}>
        <FontAwesomeIcon icon={faDroplet} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorColorPickerPopover}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <HexColorPicker color={color} onChange={setColor} />
        <Typography color={color} sx={{ p: 1 }}>{color}</Typography>
      </Popover>
    </Box>
  )
}
