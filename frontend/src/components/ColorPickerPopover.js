import * as React from 'react'
import { Box, Popover, IconButton, Typography } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import PropTypes from 'prop-types'


export default function ColorPickerPopover(props) {
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
          sx={{ width: props.width || 20, height: props.height || 20, bgcolor: props.color, borderRadius: 1 }}
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
        <HexColorPicker color={props.color} onChange={props.onChange} />
        <Typography color={props.color} sx={{ p: 1 }}>
          {props.color}
        </Typography>
      </Popover>
    </Box>
  )
}

ColorPickerPopover.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
}
