import * as React from 'react'
import PropTypes from 'prop-types'
import {
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material'

import useUsers from '../../api/useUsers'

function WorkspaceAssignUserSelect(props) {
  const { data: usersObject, isLoading, isError } = useUsers()
  const [open, setOpen] = React.useState(true)
  const [usersToAssign, setUsersToAssign] = React.useState([])

  React.useEffect(() => {
    const users = usersObject?.users
    if (!usersObject?.users) return

    const assignedUserIds = Object.fromEntries(props.assignedUsers.map((user) => [user.id, true]))
    const newUsersToAssign = users.filter((user) => !Object.prototype.hasOwnProperty.call(assignedUserIds, user.id))
    setUsersToAssign(newUsersToAssign)
  }, [props.assignedUsers, usersObject?.users])

  return (
    <Autocomplete
      id='assign-user-to-workspace-select'
      open={open}
      onChange={props.onChange}
      onOpen={() => setOpen(true) }
      onClose={() => setOpen(false) }
      onBlur={props.onBlur}
      isOptionEqualToValue={(option, other) => option.id === other.id}
      getOptionLabel={(option) => option.name}
      options={usersToAssign}
      loading={isLoading || isError}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Assign'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading || isError ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

WorkspaceAssignUserSelect.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  assignedUsers: PropTypes.arrayOf(PropTypes.object)
}

export default WorkspaceAssignUserSelect
