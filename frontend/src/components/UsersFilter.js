import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, InputAdornment, FormControl, MenuItem, OutlinedInput, Select, Typography, InputLabel, Chip, Stack } from '@mui/material'

import WorkspaceIcon from './WorkspaceIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './UsersFilter.sass'


const UsersFilter = (props) => {
  const [searchFiled, setSearchField] = React.useState('')
  const [workspaceFiled, setWorkspaceField] = React.useState('')
  const [roles, setRoles] = React.useState(['Admin', 'Manager', 'Developer', 'Regular', 'Guest'])

  const toggleRoleChip = (e) => {
    const role = e.target.textContent
    console.log(e.target.textContent)
    e.target.style.backgroundColor = 'red'
    console.log(e)

    let newRoles
    if (roles.includes(role)) {
      newRoles = roles.filter((item) => item !== role)
    } else {
      newRoles = [...roles, role]
    }
    setRoles(newRoles)
  }

  return (
    <div className='UsersFilter-wrapper'>
      <Typography>
        Filters
      </Typography>
      <FormControl className='formControls'>
        <OutlinedInput
          id='UserFilter-search-input'
          value={searchFiled}
          placeholder='Search'
          onChange={(event) => setSearchField(event.target.value)}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='search'
                onClick={() => console.log('click')}
                edge='end'
              >
                <FontAwesomeIcon className='UserFilter-search-icon' icon={faMagnifyingGlass} />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl className='formControls'>
        <Select
          id='UserFilter-select-label'
          value={workspaceFiled}
          displayEmpty
          onChange={(event) => setWorkspaceField(event.target.value)}
        >
          <MenuItem value=''>Workspace</MenuItem>
          { !props.dataLoadingOrError && props?.workspaces.map((workspace, idx) => (
            <MenuItem
              value={workspace.name}
              key={`${workspace.name}-${idx}`}
            >
              <WorkspaceIcon name={workspace.name} size={32} />
              {workspace.name}
            </MenuItem>
          ))
          }
        </Select>
      </FormControl>
      <FormControl>
        <Typography>Roles</Typography>
        <Stack direction='row' spacing={1}>
          <Chip label='Admin' onClick={toggleRoleChip} />
          <Chip label='Manager' onClick={toggleRoleChip} />
          <Chip label='Developer' onClick={toggleRoleChip} />
          <Chip label='Regular' onClick={toggleRoleChip} />
          <Chip label='Guest' onClick={toggleRoleChip} />
        </Stack>
      </FormControl>
    </div>
  )
}

UsersFilter.propTypes = {
  workspaces: PropTypes.array.isRequired,
  dataLoadingOrError: PropTypes.bool.isRequired,
  filters: PropTypes.object
}

export default UsersFilter
