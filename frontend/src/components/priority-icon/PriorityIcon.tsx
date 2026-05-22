import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { SizeProp } from '@fortawesome/fontawesome-svg-core'

import { prioritiesMap } from '../../internal/priorities'

import './PriorityIcon.sass'

interface Props {
  taskPriority?: string
  size?: SizeProp
}

const PriorityIcon = ({ taskPriority, size }: Props) => {
  const priorityObject = prioritiesMap[taskPriority!]
  if (!priorityObject || priorityObject.symbol == null) return

  return <FontAwesomeIcon size={size || 'lg'} color={priorityObject.color!} icon={priorityObject.icon!} />
}

export default PriorityIcon
