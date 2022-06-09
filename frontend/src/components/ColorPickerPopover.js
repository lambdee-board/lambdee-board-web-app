import * as React from 'react'
import { Box, Popover, IconButton, Typography } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import PropTypes from 'prop-types'


export default function ColorPickerPopover({ color, onChange }) {
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

      <IconButton size='small' sx={{ mr: 1 }} onClick={handleClick}>
        <Box
          sx={{ width: 20, height: 20, bgcolor: color }}
        />
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

ColorPickerPopover.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
