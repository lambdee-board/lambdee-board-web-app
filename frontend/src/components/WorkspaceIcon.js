import { toSvg } from 'jdenticon'
import PropTypes from 'prop-types'

function WorkspaceIcon(props) {
  const svgString = toSvg(props.name, props.size)
  return (
    <div dangerouslySetInnerHTML={{ __html: svgString }}></div>
  )
}

WorkspaceIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
}

export default WorkspaceIcon
