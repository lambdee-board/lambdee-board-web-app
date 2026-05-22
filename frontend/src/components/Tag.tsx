import { Chip } from '@mui/material'

import textColor from '../utils/text-color'

interface Props {
  name: string
  color: string
  deletable?: boolean
  onDelete?: () => void
}

function Tag({ name, color, deletable, onDelete }: Props) {
  return (
    <Chip
      className='Tag'
      label={name}
      sx={{ color: textColor(color), bgcolor: color, display: 'flex', alignSelf: 'center' }}
      size='small'
      onDelete={deletable || false ? onDelete : undefined} />
  )
}

export default Tag
