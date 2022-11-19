import * as React from 'react'

import {
  Box,
  Card,
  Pagination
} from '@mui/material'
import { useParams } from 'react-router-dom'

import { useBoardSprints, mutateBoardSprints } from '../../../api/board-sprints'

import ReportCard from '../../../components/reports-view/ReportCard'

import './ReportsView.sass'

const ReportsView = () => {
  const { boardId } = useParams()
  const perPage = 10
  const [filter, setFilter] = React.useState({ page: 1, per: perPage })
  const { data: boardSprints, isLoading, isError } = useBoardSprints({ id: boardId, axiosOptions: { params: filter } })

  const [totalPages, setTotalPages] = React.useState(0)

  React.useEffect(() => {
    if (!boardSprints?.totalPages) return

    setTotalPages(boardSprints?.totalPages)
  }, [boardSprints?.totalPages])

  const fetchNextUserPage = (event, newPage) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutateBoardSprints({ axiosOptions: { params: newFilterPage }, data: { ...boardSprints, totalPages } })
  }


  return (

    <Box className='ReportView-wrapper'>
      {boardSprints?.sprints?.length > 0  &&
      <Box className='ReportView' >
        {isLoading || isError ? (
          <Box></Box>
        ) : (
          <Card sx={{ ml: '8px', mr: '8px' }}>
            {boardSprints.sprints?.map((sprint) => (
              <ReportCard key={sprint.id}
                sprintId = {sprint.id}
                sprintName = {sprint.name}
                sprintDescription = {sprint.description}
                sprintStartedAt = {sprint.startedAt}
                sprintExpectedEndAt = {sprint.expectedEndAt}
                sprintEndedAt = {sprint.endedAt}
              />
            ))}
          </Card>
        )}
        { boardSprints?.totalPages > 1 &&
              <Pagination
                className='Pagination-bar'
                count={totalPages || 0}
                color='primary'
                onChange={fetchNextUserPage}
                size='large'
                page={filter.page} />
        }
      </Box>
      }
    </Box>
  )
}

export default ReportsView


