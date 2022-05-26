import { Chip } from '@mui/material'
import PropTypes from 'prop-types'

import textColour from '../utils/textColour'

function Tag(props) {
  return (
    <Chip
      className='Tag'
      label={props.name}
      sx={{ color: textColour(props.colour), bgcolor: props.colour }}
      size='small' />
  )
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
}

export default Tag