import PropTypes from 'prop-types'
import {
  faAngleDoubleUp,
  faAngleUp,
  faMinus,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PriorityIcon.sass'

class Priority {
  constructor(color, icon) {
    this.color = color
    this.icon = icon
  }
}

const PRIORITIES = {
  highest: new Priority('red', faAngleDoubleUp),
  high: new Priority('orange', faAngleUp),
  normal: new Priority('yellow', faMinus),
  low: new Priority('green', faAngleDown),
}

const PriorityIcon = (props) => {
  const priorityObject = PRIORITIES[props.taskPriority]
  if (!priorityObject) return

  return <FontAwesomeIcon className='PriorityIcon' color={priorityObject.color} icon={priorityObject.icon} />
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string,
}

export default PriorityIcon
