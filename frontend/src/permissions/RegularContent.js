import PropTypes from 'prop-types'

const REGULAR_ROLES = new Set(['regular', 'developer', 'manager', 'admin'])

export const isRegular = () => REGULAR_ROLES.has(localStorage.getItem('role'))

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
