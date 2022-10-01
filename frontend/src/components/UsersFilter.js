import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, InputAdornment, FormControl, MenuItem, OutlinedInput, Select, Typography, Stack } from '@mui/material'

import WorkspaceIcon from './WorkspaceIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './UsersFilter.sass'
import RoleChip from './RoleChip'


const UsersFilter = (props) => {
  const [searchFiled, setSearchField] = React.useState('')
  const [workspaceFiled, setWorkspaceField] = React.useState('')
  const defaultRoles = ['Admin', 'Manager', 'Developer', 'Regular', 'Guest']
  const [roles, setRoles] = React.useState(defaultRoles)
  const colors = [
    'linear-gradient(248.86deg, #F34483 -15.19%, #EB2149 115.06%)',
    'linear-gradient(250.72deg, #029FD1 -16.17%, #0288D1 114.3%)',
    'linear-gradient(248.12deg, #2FD89B -12.19%, #13C669 112.96%)',
    'linear-gradient(249.19deg, #EF904B -15.27%, #EC662C 115.97%)',
    'linear-gradient(250.91deg, #808080 -15.11%, #676767 111.11%)'
  ]

  const toggleRoleChip = (role) => {
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
      <Typography className='UserFilter-title'>
        Filters
      </Typography>
      <FormControl className='formControls'>
        <Typography>User</Typography>
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
        <Typography>Workspace</Typography>
        <Select
          id='UserFilter-select-label'
          value={workspaceFiled}
          displayEmpty
          onChange={(event) => setWorkspaceField(event.target.value)}
        >
          <MenuItem value=''>None</MenuItem>
          { !props.dataLoadingOrError && props?.workspaces.map((workspace, idx) => (
            <MenuItem
              value={workspace.name}
              key={`${workspace.name}-${idx}`}
              className='UserFilter-select-item'
            >
              <WorkspaceIcon name={workspace.name} size={32} />
              {workspace.name}
            </MenuItem>
          ))
          }
        </Select>
      </FormControl>
      <FormControl className='formControls'>
        <Typography>Roles</Typography>
        <Stack className='chipStack' direction='row'>
          {defaultRoles.map((role, idx) => (
            <RoleChip
              key={role + idx}
              name={role}
              color={colors[idx]}
              onClickFunc={toggleRoleChip}
            />
          ))}
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
