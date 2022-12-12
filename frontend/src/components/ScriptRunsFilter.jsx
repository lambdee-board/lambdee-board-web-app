import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, OutlinedInput, Typography, Stack, InputLabel, Button } from '@mui/material'

import './ScriptRunsFilter.sass'
import RoleChip from './RoleChip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


const ScriptRunsFilter = (props) => {
  const [nameSearch, setNameSearch] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')


  const defaultStates = ['running', 'executed', 'failed', 'timed_out', 'waiting', 'connection_failed']
  const [roles, setRoles] = React.useState([defaultStates])
  const stateColors = {
    'running': '#03a9f4',
    'executed': '#4caf50',
    'failed': '#ff1744',
    'timed_out': '#ff9800',
    'connection_failed': '#af52bf',
    'waiting': '#aaa'
  }

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
    <div className='ScriptRunsFilter-wrapper'>
      <Typography className='ScriptRunsFilter-title'>
        Filters
      </Typography>
      <FormControl className='formControls'>
        <InputLabel htmlFor='ScriptRunsFilter-search-input' shrink >ScriptRuns name</InputLabel>
        <OutlinedInput
          id='ScriptRunsFilter-search-input'
          value={nameSearch}
          label='Script name'
          notched
          placeholder='Hello world script'
          onKeyDown={enterPressed}
          onChange={(event) => setNameSearch(event.target.value)}
        />
      </FormControl>
      <FormControl className='formControls'>
        <Typography className='form-label'>States</Typography>
        <Stack className='chipStack' direction='row'>
          {defaultStates.map((state, idx) => (
            <RoleChip
              key={state + idx}
              name={state}
              color={stateColors[state]}
              onClickFunc={toggleRoleChip}
            />
          ))}
        </Stack>
      </FormControl>
      <div className='formControls'>
        <Typography className='form-label'>Date</Typography>
        <div className='date-wrapper'>
          <FormControl className='date-block'>
            <InputLabel htmlFor='ScriptRunsFilter-date-start' shrink >From</InputLabel>
            <OutlinedInput
              id='ScriptRunsFilter-date-start'
              type='date'
              label='From'
              notched
              value={startDate}
              onKeyDown={enterPressed}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </FormControl>
          <FormControl className='date-block'>
            <InputLabel htmlFor='ScriptRunsFilter-date-end' shrink>To</InputLabel>
            <OutlinedInput
              id='ScriptRunsFilter-date-end'
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
        className='ScriptRunsFilter-search-button'
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

ScriptRunsFilter.propTypes = {
  updateFilters: PropTypes.func.isRequired
}

export default ScriptRunsFilter
