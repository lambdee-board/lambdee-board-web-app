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
  very_low: new Priority('#029FD1', faAngleDoubleDown),
  low: new Priority('#2FD89B', faAngleDown),
  medium: new Priority('#FFCA28', faMinus),
  high: new Priority('#EC662C', faAngleUp),
  very_high: new Priority('#F34483', faAngleDoubleUp),
}
/* eslint-enable camelcase */

const PriorityIcon = (props) => {
  const priorityObject = PRIORITIES[props.taskPriority]
  if (!priorityObject) return

  return <FontAwesomeIcon size={props.size || 'lg'} color={priorityObject.colour} icon={priorityObject.icon} />
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string,
  size: PropTypes.string,
}

export default PriorityIcon
