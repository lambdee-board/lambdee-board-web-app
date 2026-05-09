import { Chip } from '@mui/material'

import textColour from '../utils/text-colour'

interface Props {
  name: string
  colour: string
  deletable?: boolean
  onDelete?: () => void
}

function Tag({ name, colour, deletable, onDelete }: Props) {
  return (
    <Chip
      className='Tag'
      label={name}
      sx={{ color: textColour(colour), bgcolor: colour, display: 'flex', alignSelf: 'center' }}
      size='small'
      onDelete={deletable || false ? onDelete : undefined} />
  )
}

export default Tag
