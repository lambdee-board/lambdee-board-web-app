import PropTypes from 'prop-types'
import { faAngleDoubleUp, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const PriorityIcon = (props) => {
  if (props.priority === 'high')  return <FontAwesomeIcon color='red' icon={faAngleDoubleUp} />
  else if (props.priority  === 'low') return  <FontAwesomeIcon color='orange' icon={faAngleUp} />
  return ''
}

PriorityIcon.defaultProps = {
  priority: '',
}

PriorityIcon.propTypes = {
  priority: PropTypes.string.isRequired,
}


export default PriorityIcon
