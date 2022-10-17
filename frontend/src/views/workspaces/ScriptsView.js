import * as React from 'react'
import {
  Box,
  Card,
  Typography,
  Button
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'

import './ScriptsView.sass'


const ScriptsView = () => {
  return (

    <Box className='ScriptsView-wrapper'>
      <Box className='ScriptsView' >
        <Card className='ScriptsView-card'>
          <Typography variant='h2' fontSize={32} sx={{ m: '24px' }}>
            This workspace
          </Typography>
          <div>
            <Button className='Add-script-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>Add Script</Typography>
            </Button>
          </div>
        </Card>
        <Card className='ScriptsView-card'>
          <Typography variant='h2' fontSize={32} sx={{ m: '24px' }}>
            Shared
          </Typography>
          <Button className='Add-script-button' color='primary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>Add Script</Typography>
          </Button>
        </Card>
      </Box>
    </Box>
  )
}

export default ScriptsView


