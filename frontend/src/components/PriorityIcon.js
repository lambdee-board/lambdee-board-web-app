import PropTypes from 'prop-types'
import { faAngleDoubleUp, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const PriorityIcon = (props) => {
  if (props.taskPriority === 'high')  return <FontAwesomeIcon color='red' icon={faAngleDoubleUp} />
  else if (props.taskPriority  === 'low') return  <FontAwesomeIcon color='orange' icon={faAngleUp} />
  return ''
}

PriorityIcon.defaultProps = {
  taskPriority: '',
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string.isRequired,
}


export default PriorityIcon
