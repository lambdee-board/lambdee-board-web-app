import PropTypes from 'prop-types'

import { isManager } from '../../internal/permissions'

export const ManagerContent = ({ children }) => {
  if (!isManager()) return null

  return (
    <>
      {children}
    </>
  )
}

ManagerContent.propTypes = {
  children: PropTypes.any
}

export default ManagerContent
