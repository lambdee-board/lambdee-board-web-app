import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptTriggers from '../api/scripts-triggers'

import './ScriptButton.sass'


export default function ScriptButton({ variant, scope, id }) {
  const { data: scriptTriggers, isLoading, isError } = useScriptTriggers({ scope, id })

  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenScripts = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseScripts = () => {
    setAnchorElUser(null)
  }
  if (isLoading || isError) return (<></>)

  return (
    <>
      {variant === 'icon' ?       <>
        <IconButton color='secondary' onClick={handleOpenScripts}>
          <FontAwesomeIcon icon={faBolt} />
        </IconButton>
        <Menu
          id='scripts'
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseScripts}
        >
          <MenuItem key={'user-account'}
          >
            <Typography textAlign='center'>Account</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign='center'>Logout</Typography>
          </MenuItem>
        </Menu>
      </> :  <> <Button sx={{ ml: '6%' }}
        onClick={handleOpenScripts}
        className='ScriptButton'
        color='secondary'
        variant='outlined'
        startIcon={<FontAwesomeIcon icon={faBolt} />}>
              Actions
      </Button>
      {console.log(scriptTriggers)}
      <Menu
        id='scripts'
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseScripts}
      >
        <MenuItem key={'user-account'}
        >
          <Typography textAlign='center'>Account</Typography>
        </MenuItem>
        <MenuItem>
          <Typography textAlign='center'>Logout</Typography>
        </MenuItem>
      </Menu>
      </>}
    </>
  )
}

ScriptButton.defaultProps = {
  variant: 'default'
}

ScriptButton.propTypes = {
  variant: PropTypes.string.isRequired,
  scope: PropTypes.string.isRequired,
  id: PropTypes.any.isRequired
}

