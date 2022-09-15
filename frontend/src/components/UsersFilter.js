import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

import './UsersFilter.sass'


const UsersFilter = (props) => {
  const [searchFiled, setSearchField] = React.useState('')

  return (
    <div className='UsersFilter-wrapper'>
      <Typography>
        Filters
      </Typography>
      <FormControl variant='outlined'>
        <InputLabel>Search</InputLabel>
        <OutlinedInput
          id='UserFilter-search-input'
          // type={'text'}
          value={searchFiled}
          onChange={(text) => setSearchField(text)}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='search'
                onClick={() => console.log('click')}
                onMouseDown={() => console.log('xd?')}
                edge='end'
              >
                <FontAwesomeIcon className='UserFilter-search-icon' icon={faMagnifyingGlass} />
              </IconButton>
            </InputAdornment>
          }
          label='Password'
        />
      </FormControl>
    </div>
  )
}

UsersFilter.propTypes = {

}

export default UsersFilter
