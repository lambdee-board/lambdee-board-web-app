import * as React from 'react'
import {
  Typography,
  Stack
} from '@mui/material'

interface Props {
  label: string
  data?: React.ReactNode
}

const LabeledData = ({ label, data }: Props) => {
  return (
    <Stack>
      <Typography sx={{ pt: 0.5, pl: 1, pr: 0.5 }}>{label}</Typography>
      <Typography sx={{ pb: 0.5, pl: 1, pr: 0.5 }} variant='caption'>{data}</Typography>
    </Stack>
  )
}

export default LabeledData
