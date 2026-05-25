import * as React from 'react'

import {
  Box,
  Card,
  Pagination
} from '@mui/material'
import { useParams } from 'react-router-dom'

import { useBoardSprints, mutateBoardSprints } from '../../../../api/board-sprints'

import ReportCard from '../../../../components/reports-view/report-card/ReportCard'


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

  const fetchNextUserPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutateBoardSprints({ id: boardId!, axiosOptions: { params: newFilterPage }, data: { ...boardSprints, totalPages } })
  }


  return (

    <Box sx={{ pt: 1, pl: 2.5, pr: 1.5, pb: 1 }}>
      {boardSprints?.sprints?.length > 0  &&
      <Box sx={{ bgcolor: 'primary.light', display: 'inline-flex', flexFlow: 'column', borderRadius: '8px', width: '98%', p: 2, minWidth: '1000px' }}>
        {isLoading || isError ? (
          <Box></Box>
        ) : (
          <Card sx={{ mx: 1 }}>
            {boardSprints.sprints?.map((sprint) => (
              <ReportCard key={sprint.id}
                sprintId={sprint.id}
                sprintName={sprint.name}
                sprintDescription={sprint.description}
                sprintStartedAt={sprint.startedAt}
                sprintExpectedEndAt={sprint.expectedEndAt}
                sprintEndedAt={sprint.endedAt ?? undefined}
              />
            ))}
          </Card>
        )}
        { boardSprints?.totalPages > 1 &&
              <Pagination
                sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}
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
