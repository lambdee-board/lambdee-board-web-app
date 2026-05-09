import * as React from 'react'

import {
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material'

import useWorkspaceUsers from '../../api/workspace-users'
import type { UserShort } from '../../types'

interface Props {
  onBlur?: () => void
  onChange?: (event: React.SyntheticEvent, value: UserShort | null) => void
  assignedUsers?: UserShort[]
  workspaceId?: string | number
}

function AssignUserSelect({ onBlur, onChange, assignedUsers = [], workspaceId }: Props) {
  const { data: usersObject, isLoading, isError } = useWorkspaceUsers({ id: workspaceId })
  const [open, setOpen] = React.useState(true)
  const [usersToAssign, setUsersToAssign] = React.useState<UserShort[]>([])

  React.useEffect(() => {
    const users = usersObject?.users
    if (!usersObject?.users) return

    const assignedUserIds = Object.fromEntries(assignedUsers.map((user) => [user.id, true]))
    const newUsersToAssign = users.filter((user) => !Object.prototype.hasOwnProperty.call(assignedUserIds, user.id))
    setUsersToAssign(newUsersToAssign)
  }, [assignedUsers, usersObject?.users])

  return (
    <Autocomplete
      id='assign-user-to-task-select'
      open={open}
      onChange={onChange}
      onOpen={() => setOpen(true) }
      onClose={() => setOpen(false) }
      onBlur={onBlur}
      isOptionEqualToValue={(option, other) => option.id === other.id}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
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

export default AssignUserSelect
