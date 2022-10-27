import PropTypes from 'prop-types'

const MANAGER_ROLES = new Set(['manager', 'admin'])

export const isManager = () => MANAGER_ROLES.has(localStorage.getItem('role'))

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

