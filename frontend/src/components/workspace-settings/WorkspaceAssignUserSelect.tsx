import * as React from 'react'

import {
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material'

import useUsers from '../../api/users'
import type { UserShort } from '../../types'

interface Props {
  onBlur?: () => void
  onChange?: (event: React.SyntheticEvent, value: UserShort | null) => void
  assignedUsers?: UserShort[]
}

function WorkspaceAssignUserSelect({ onBlur, onChange, assignedUsers = [] }: Props) {
  const { data: usersObject, isLoading, isError } = useUsers()
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
      id='assign-user-to-workspace-select'
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
          slotProps={{
            ...params.slotProps,
            input: {
              ...(params.slotProps?.input as object),
              endAdornment: (
                <React.Fragment>
                  {isLoading || isError ? <CircularProgress color='inherit' size={20} /> : null}
                  {(params.slotProps?.input as any)?.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  )
}

export default WorkspaceAssignUserSelect
