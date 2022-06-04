import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { prioritiesMap } from '../constants/priorities'

import './PriorityIcon.sass'

const PriorityIcon = (props) => {
  const priorityObject = prioritiesMap[props.taskPriority]
  if (!priorityObject || priorityObject.symbol == null) return

  return <FontAwesomeIcon size={props.size || 'lg'} color={priorityObject.colour} icon={priorityObject.icon} />
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string,
  size: PropTypes.string,
}

export default PriorityIcon
