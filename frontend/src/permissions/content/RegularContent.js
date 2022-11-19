import PropTypes from 'prop-types'

import { isRegular } from '../../internal/permissions'

export const RegularContent = ({ children }) => {
  if (!isRegular()) return null

  return (
    <>
      {children}
    </>
  )
}

RegularContent.propTypes = {
  children: PropTypes.any
}

export default RegularContent
