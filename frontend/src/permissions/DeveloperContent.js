import PropTypes from 'prop-types'

const DEVELOPER_ROLES = new Set(['developer', 'manager', 'admin'])

export const isDeveloper = () => DEVELOPER_ROLES.has(localStorage.getItem('role'))

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

