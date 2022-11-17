import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  Typography
} from '@mui/material'
import { LineChart, PieChart } from 'react-chartkick'
import 'chartkick/chart.js'


import './ReportModal.sass'
import useSprintChart from '../../api/useSprintChart'
import LabeledData from '../LabeledData'


const ReportModal = (props) => {
  const { data: burnUpChart, isLoading, isError } = useSprintChart({ id: props.sprintId })
  const workScope = burnUpChart?.at(0).data
  const completedWork = burnUpChart?.at(-1).data

  if (isLoading || isError) return // TODO: Skeleton


  return (
    <Box className='ReportModal-wrapper'>
      <Card className='ReportModal-paper'>
        <Box className='ReportModal-info'>
          <Box className='ReportModal-info-left'>
            <Typography fontSize={24} sx={{ mb: '12px' }}>{props.sprintName}</Typography>
            <Typography sx={{ overflowWrap: 'break-word' }} fontSize={18}>{props.sprintDescription}</Typography>
          </Box>
          <Box className='ReportModal-info-middle'>
            <LabeledData label='Work Scope' data={Object.values(workScope).at(-1)} />
            <LabeledData label='Completed Work' data={Object.values(completedWork).at(-1)} />
            <LabeledData label='Uncompleted Work' data={Object.values(workScope).at(-1) - Object.values(completedWork).at(-1)} />
          </Box>
          <Box className='ReportModal-info-right'>
            <LabeledData label='Sprint Start' data={props.sprintStartedAt} />
            <LabeledData label='Sprint Expected End' data={props.sprintExpectedEndAt} />
            <LabeledData label='Sprint End' data={props.sprintEndedAt ? props.sprintEndedAt : null} />
          </Box>
        </Box>
        <Box className='ReportModal-chart'>
          {console.log(Object.values(workScope).at(-1) - Object.values(completedWork).at(-1))}
          <PieChart colors={['#1082F3', '#7b1fa2']} data={[['Completed Work', Object.values(completedWork).at(-1)], ['Uncompleted Work', Object.values(workScope).at(-1) - Object.values(completedWork).at(-1)]]} />
        </Box>
        <Box className='ReportModal-chart'>
          <LineChart colors={['#7b1fa2', '#1082F3']} data = {burnUpChart} xtitle='Date' ytitle='Points' curve={false} />
        </Box>
      </Card>
    </Box>
  )
}

export default ReportModal

ReportModal.propTypes = {
  sprintId: PropTypes.number.isRequired,
  sprintName: PropTypes.string.isRequired,
  sprintDescription: PropTypes.string.isRequired,
  sprintStartedAt: PropTypes.string.isRequired,
  sprintExpectedEndAt: PropTypes.string.isRequired,
  sprintEndedAt: PropTypes.string
}

