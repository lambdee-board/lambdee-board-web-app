import PropTypes from 'prop-types'
import { faAngleDoubleUp, faAngleUp, faAngleDown, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const PriorityIcon = (props) => {
  if (props.taskPriority === 'very high')  return  <FontAwesomeIcon color='red' icon={faAngleDoubleUp} />
  else if (props.taskPriority  === 'high') return  <FontAwesomeIcon color='orange' icon={faAngleUp} />
  else if (props.taskPriority  === 'normal') return  <FontAwesomeIcon color='yellow' icon={faAngleDown} />
  else if (props.taskPriority  === 'low') return  <FontAwesomeIcon color='green' icon={faAngleDoubleDown} />
  return ''
}

PriorityIcon.defaultProps = {
  taskPriority: '',
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string.isRequired,
}


export default PriorityIcon
