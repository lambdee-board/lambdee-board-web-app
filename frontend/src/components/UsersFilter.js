import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, MenuItem, OutlinedInput, Select, Typography, Stack, InputLabel, Button } from '@mui/material'

import WorkspaceIcon from './WorkspaceIcon'

import './UsersFilter.sass'
import RoleChip from './RoleChip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


const UsersFilter = (props) => {
  const [nameSearch, setNameSearch] = React.useState('')
  const [workspaceFiled, setWorkspaceField] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')

  const defaultRoles = ['admin', 'manager', 'developer', 'regular', 'guest']
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

  const getFilters = (() => {
    const formattedEndDate = endDate.replaceAll('-', '.')
    const formattedStartDate = startDate.replaceAll('-', '.')
    const newFilters = {
      roleCollection: roles,
      createdAtTo: formattedEndDate,
      createdAtFrom: formattedStartDate,
      workspaceId: workspaceFiled,
      search: nameSearch
    }
    props.updateFilters(newFilters)
  })


  const enterPressed = (e) => {
    if (e.key === 'Enter') {
      console.log(e.key)
      getFilters()
    }
  }


  return (
    <div className='UsersFilter-wrapper'>
      <Typography className='UserFilter-title'>
        Filters
      </Typography>
      <FormControl className='formControls'>
        <InputLabel htmlFor='UserFilter-search-input' shrink >User name</InputLabel>
        <OutlinedInput
          id='UserFilter-search-input'
          value={nameSearch}
          label='User name'
          notched
          placeholder='John Doe'
          onKeyDown={enterPressed}
          onChange={(event) => setNameSearch(event.target.value)}
        />
      </FormControl>
      <FormControl className='formControls'>
        <InputLabel htmlFor='UserFilter-select-label' shrink >Workspace</InputLabel>
        <Select
          id='UserFilter-select-label'
          value={workspaceFiled}
          displayEmpty
          label='Workspace'
          notched
          onChange={(event) => setWorkspaceField(event.target.value)}
        >
          <MenuItem value=''>None</MenuItem>
          { !props.dataLoadingOrError && props?.workspaces.map((workspace, idx) => (
            <MenuItem
              value={workspace.id}
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
        <Typography className='form-label'>Roles</Typography>
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
      <div className='formControls'>
        <Typography className='form-label'>Account creation date</Typography>
        <div className='date-wrapper'>
          <FormControl className='date-block'>
            <InputLabel htmlFor='UserFilter-date-start' shrink >From</InputLabel>
            <OutlinedInput
              id='UserFilter-date-start'
              type='date'
              label='From'
              notched
              value={startDate}
              onKeyDown={enterPressed}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </FormControl>
          <FormControl className='date-block'>
            <InputLabel htmlFor='UserFilter-date-end' shrink>To</InputLabel>
            <OutlinedInput
              id='UserFilter-date-end'
              type='date'
              label='To'
              notched
              value={endDate}
              onKeyDown={enterPressed}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </FormControl>
        </div>
      </div>
      <Button
        onClick={getFilters}
        className='userSettings-reset-password-button'
        color='primary'
        variant='contained'
        fullWidth
        startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
      >
          Search
      </Button>
    </div>
  )
}

UsersFilter.propTypes = {
  workspaces: PropTypes.array.isRequired,
  dataLoadingOrError: PropTypes.bool.isRequired,
  updateFilters: PropTypes.func.isRequired
}

export default UsersFilter
