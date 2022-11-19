import { Chip } from '@mui/material'
import PropTypes from 'prop-types'

import textColour from '../utils/text-colour'

function Tag(props) {
  return (
    <Chip
      className='Tag'
      label={props.name}
      sx={{ color: textColour(props.colour), bgcolor: props.colour, display: 'flex', alignSelf: 'center' }}
      size='small'
      onDelete={props.deletable || false ? props.onDelete : undefined} />
  )
}

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  deletable: PropTypes.bool,
  onDelete: PropTypes.func,
}

export default Tag
