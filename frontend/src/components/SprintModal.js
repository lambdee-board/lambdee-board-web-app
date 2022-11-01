import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  Skeleton,
  Avatar,
  Stack,
  IconButton,
  Button,
} from '@mui/material'

import './SprintModal.sass'

const SprintModal = ({ closeModal }) => {
  return (
    <Box className='SprintModal-wrapper'>
      <Card className='SprintModal-paper'>
        <Box className='SprintModal-main'>

        </Box>
      </Card>
    </Box>
  )
}

export default SprintModal

SprintModal.propTypes = {
  closeModal: PropTypes.func.isRequired
}
