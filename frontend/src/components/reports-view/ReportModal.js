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
  // const workScope = burnUpChart?.at(0).data[props.sprintStartedAt?.split('.').reverse().join('_')] || 0
  // const completedWork = burnUpChart?.at(-1).data[props.sprintEndedAt?.split('.').reverse().join('_')] || 0

  if (isLoading || isError) return // TODO: Skeleton

  console.log(burnUpChart[0].data)
  return (
    <Box className='ReportModal-wrapper'>
      <Card className='ReportModal-paper'>
        <Box className='ReportModal-info'>
          <Box className='ReportModal-info-left'>
            <Typography fontSize={24} sx={{ mb: '12px' }}>{props.sprintName}</Typography>
            <Typography sx={{ overflowWrap: 'break-word' }} fontSize={18}>{props.sprintDescription}</Typography>
          </Box>
          <Box className='ReportModal-info-middle'>
            {/* <LabeledData label='Work Scope' data={workScope} />
            <LabeledData label='Completed Work' data={completedWork} />
            <LabeledData label='Uncompleted Work' data={Number(workScope) - Number(completedWork)} /> */}
          </Box>
          <Box className='ReportModal-info-right'>
            <LabeledData label='Sprint Start' data={props.sprintStartedAt} />
            <LabeledData label='Sprint Expected End' data={props.sprintExpectedEndAt} />
            <LabeledData label='Sprint End' data={props.sprintEndedAt ? props.sprintEndedAt : null} />
          </Box>
        </Box>
        <Box className='ReportModal-chart'>
          {/* <PieChart colors={['#1082F3', '#7b1fa2']} data={[['Completed Work', completedWork], ['Uncompleted Work', Number(workScope) - Number(completedWork)]]} /> */}
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

