import PropTypes from 'prop-types'
import {
  faAngleDoubleUp,
  faAngleUp,
  faMinus,
  faAngleDown,
  faAngleDoubleDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PriorityIcon.sass'

class Priority {
  constructor(colour, icon) {
    this.colour = colour
    this.icon = icon
  }
}

/* eslint-disable camelcase */
const PRIORITIES = {
  very_low: new Priority('blue', faAngleDoubleDown),
  low: new Priority('green', faAngleDown),
  medium: new Priority('yellow', faMinus),
  high: new Priority('orange', faAngleUp),
  very_high: new Priority('red', faAngleDoubleUp),
}
/* eslint-enable camelcase */

const PriorityIcon = (props) => {
  const priorityObject = PRIORITIES[props.taskPriority]
  if (!priorityObject) return

  return <FontAwesomeIcon size={props.size} color={priorityObject.colour} icon={priorityObject.icon} />
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string,
  size: PropTypes.string,
}

export default PriorityIcon
