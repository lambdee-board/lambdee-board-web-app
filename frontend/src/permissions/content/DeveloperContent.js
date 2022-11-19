import PropTypes from 'prop-types'

import { isDeveloper } from '../../internal/permissions'

export const DeveloperContent = ({ children }) => {
  if (!isDeveloper()) return null

  return (
    <>
      {children}
    </>
  )
}

DeveloperContent.propTypes = {
  children: PropTypes.any
}

export default DeveloperContent
