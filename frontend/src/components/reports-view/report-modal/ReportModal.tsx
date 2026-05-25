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
    <Box sx={{ overflowY: 'scroll', maxHeight: '100vh', msOverflowStyle: 'none', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Card sx={{ width: 'calc(100vw - 40px)', maxWidth: '1100px', display: 'flex', flexDirection: 'column', alignContent: 'flex-start', justifyContent: 'space-between', bgcolor: 'primary.light' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', m: 4 }}>
          <Box sx={{ display: 'flex', width: '60%', flexDirection: 'column', pr: 4 }}>
            <Typography variant='h5' sx={{ mb: 1.5 }}>{sprintName}</Typography>
            <Typography variant='h6' sx={{ overflowWrap: 'break-word' }}>{sprintDescription}</Typography>
          </Box>
          <Box sx={{ display: 'flex', width: '15%', flexDirection: 'column' }}>
            <LabeledData label='Work Scope' data={Object.values(workScope).at(-1)} />
            <LabeledData label='Completed Work' data={Object.values(completedWork).at(i)} />
            <LabeledData label='Uncompleted Work' data={Object.values(workScope).at(-1) - Object.values(completedWork).at(i)} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'flex-end' }}>
            <LabeledData label='Sprint Start' data={sprintStartedAt} />
            <LabeledData label='Sprint Expected End' data={sprintExpectedEndAt} />
            <LabeledData label='Sprint End' data={sprintEndedAt ? sprintEndedAt : undefined} />
          </Box>
        </Box>
        <Box sx={{ m: 4 }}>
          <PieChart colors={['#1082F3', '#7b1fa2']} data={[['Completed Work', Object.values(completedWork).at(i)], ['Uncompleted Work', Object.values(workScope).at(-1) - Object.values(completedWork).at(i)]]} />
        </Box>
        <Box sx={{ m: 4 }}>
          <LineChart colors={['#7b1fa2', '#1082F3']} data = {burnUpChart} xtitle='Date' ytitle='Points' curve={false} />
        </Box>
      </Card>
    </Box>
  )
}

export default ReportModal
