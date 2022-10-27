import PropTypes from 'prop-types'

const DEVELOPER_ROLES = new Set(['regular', 'developer', 'manager', 'admin'])

export const isRegular = () => DEVELOPER_ROLES.has(localStorage.getItem('role'))

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
