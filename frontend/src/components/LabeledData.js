import * as React from 'react'
import {
  Typography,
  Stack
} from '@mui/material'
import PropTypes from 'prop-types'


const LabeledData = (props) => {
  return (
    <Stack>
      <Typography sx={{ pt: 0.5, pl: 1, pr: 0.5 }}>{props.label}</Typography>
      <Typography sx={{ pb: 0.5, pl: 1, pr: 0.5 }} variant='caption'>{props.data}</Typography>
    </Stack>
  )
}

LabeledData.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string,
}

export default LabeledData
