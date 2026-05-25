import React from 'react'
import { Box, FormControl, OutlinedInput, Typography, Stack, InputLabel, Button } from '@mui/material'


import RoleChip from '../role-chip/RoleChip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

interface Filters {
  roleCollection: string[]
  createdAtTo: string
  createdAtFrom: string
  search: string
}

interface Props {
  updateFilters: (filters: Filters) => void
}

const ScriptRunsFilter = ({ updateFilters }: Props) => {
  const [nameSearch, setNameSearch] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [endDate, setEndDate] = React.useState('')


  const defaultStates = ['running', 'executed', 'failed', 'timed_out', 'waiting', 'connection_failed']
  const [roles, setRoles] = React.useState<string[]>([...defaultStates])
  const stateColors: Record<string, string> = {
    'running': '#03a9f4',
    'executed': '#4caf50',
    'failed': '#ff1744',
    'timed_out': '#ff9800',
    'connection_failed': '#af52bf',
    'waiting': '#aaa'
  }

  const toggleRoleChip = (role: string) => {
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
    updateFilters(newFilters)
  })

  const enterPressed = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log(e.key)
      getFilters()
    }
  }


  return (
    <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: '8px', height: 'fit-content' }}>
      <Typography variant='h5' sx={{ mb: 1 }}>
        Filters
      </Typography>
      <FormControl sx={{ width: '100%', my: 2 }}>
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
      <FormControl sx={{ width: '100%', my: 2 }}>
        <Typography sx={{ mb: 1 }}>States</Typography>
        <Stack direction='row' sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
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
      <Box sx={{ width: '100%', my: 2 }}>
        <Typography sx={{ mb: 1 }}>Date</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap' }}>
          <FormControl sx={{ display: 'flex', flexDirection: 'column', pb: 1 }}>
            <InputLabel htmlFor='ScriptRunsFilter-date-start' shrink >From</InputLabel>
            <OutlinedInput
              id='ScriptRunsFilter-date-start'
              type='date'
              label='From'
              notched
              value={startDate}
              sx={{ width: '128px' }}
              onKeyDown={enterPressed}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ display: 'flex', flexDirection: 'column', pb: 1 }}>
            <InputLabel htmlFor='ScriptRunsFilter-date-end' shrink>To</InputLabel>
            <OutlinedInput
              id='ScriptRunsFilter-date-end'
              type='date'
              label='To'
              notched
              value={endDate}
              sx={{ width: '128px' }}
              onKeyDown={enterPressed}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </FormControl>
        </Box>
      </Box>
      <Button
        onClick={getFilters}
        color='primary'
        variant='contained'
        fullWidth
        startIcon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
      >
          Search
      </Button>
    </Box>
  )
}

export default ScriptRunsFilter
