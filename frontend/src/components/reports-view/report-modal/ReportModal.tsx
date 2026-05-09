import * as React from 'react'

import {
  Box,
  Card,
  Typography
} from '@mui/material'
import { LineChart, PieChart } from 'react-chartkick'

import useSprintChart from '../../../api/sprint-chart'

import LabeledData from '../../LabeledData'

import 'chartkick/chart.js'

import './ReportModal.sass'

interface Props {
  sprintId: number
  sprintName: string
  sprintDescription: string
  sprintStartedAt: string
  sprintExpectedEndAt: string
  sprintEndedAt?: string
}

const ReportModal = ({ sprintId, sprintName, sprintDescription, sprintStartedAt, sprintExpectedEndAt, sprintEndedAt }: Props) => {
  const { data: burnUpChart, isLoading, isError } = useSprintChart({ id: sprintId })
  const workScope = burnUpChart?.at(0).data
  const completedWork = burnUpChart?.at(-1).data
  let i = -1
  while (completedWork && Object.values(completedWork).at(i) === null) {
    i -= 1
  }


  if (isLoading || isError) return // TODO: Skeleton


  return (
    <Box className='ReportModal-wrapper'>
      <Card className='ReportModal-paper'>
        <Box className='ReportModal-info'>
          <Box className='ReportModal-info-left'>
            <Typography fontSize={24} sx={{ mb: '12px' }}>{sprintName}</Typography>
            <Typography sx={{ overflowWrap: 'break-word' }} fontSize={18}>{sprintDescription}</Typography>
          </Box>
          <Box className='ReportModal-info-middle'>
            <LabeledData label='Work Scope' data={Object.values(workScope).at(-1)} />
            <LabeledData label='Completed Work' data={Object.values(completedWork).at(i)} />
            <LabeledData label='Uncompleted Work' data={Object.values(workScope).at(-1) - Object.values(completedWork).at(i)} />
          </Box>
          <Box className='ReportModal-info-right'>
            <LabeledData label='Sprint Start' data={sprintStartedAt} />
            <LabeledData label='Sprint Expected End' data={sprintExpectedEndAt} />
            <LabeledData label='Sprint End' data={sprintEndedAt ? sprintEndedAt : undefined} />
          </Box>
        </Box>
        <Box className='ReportModal-chart'>
          <PieChart colors={['#1082F3', '#7b1fa2']} data={[['Completed Work', Object.values(completedWork).at(i)], ['Uncompleted Work', Object.values(workScope).at(-1) - Object.values(completedWork).at(i)]]} />
        </Box>
        <Box className='ReportModal-chart'>
          <LineChart colors={['#7b1fa2', '#1082F3']} data = {burnUpChart} xtitle='Date' ytitle='Points' curve={false} />
        </Box>
      </Card>
    </Box>
  )
}

export default ReportModal
