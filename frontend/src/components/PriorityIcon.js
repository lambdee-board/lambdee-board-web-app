import PropTypes from 'prop-types'
import { faAngleDoubleUp, faAngleUp, faAngleDown, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './PriorityIcon.sass'

const PriorityIcon = (props) => {
  switch (props.taskPriority) {
  case 'very high':
    return  <FontAwesomeIcon className='PriorityIcon' color='red' icon={faAngleDoubleUp} />
  case 'high':
    return  <FontAwesomeIcon className='PriorityIcon' color='orange' icon={faAngleUp} />
  case 'normal':
    return  <FontAwesomeIcon className='PriorityIcon' color='yellow' icon={faAngleDown} />
  case 'low':
    return  <FontAwesomeIcon className='PriorityIcon' color='green' icon={faAngleDoubleDown} />
  default:
    return ''
  }
}

PriorityIcon.defaultProps = {
  taskPriority: '',
}

PriorityIcon.propTypes = {
  taskPriority: PropTypes.string.isRequired,
}


export default PriorityIcon
