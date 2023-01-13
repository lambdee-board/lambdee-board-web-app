import * as React from 'react'

import { Divider, List, ListItemButton, Typography, Dialog, Chip, Pagination } from '@mui/material'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptRuns from '../../../api/script-runs'
import CodeHighlighter from '../../../components/CodeHighlighter'
import dayjs from 'dayjs'

import './ScriptRunsView.sass'
import ScriptRunsFilter from '../../../components/ScriptRunsFilter'

export default function ScriptRunsView() {
  const perPage = 10
  const [filter, setFilter] = React.useState({ page: 1, per: perPage })
  const [totalPages, setTotalPages] = React.useState(0)

  const { data: scriptRuns, isLoading, isError, mutate } = useScriptRuns({ axiosOptions: { params: filter } })
  const [openDial, setOpenDial] = React.useState(false)
  const [currentRun, setCurrentRun] = React.useState(null)

  const stateColors = {
    'running': '#03a9f4',
    'executed': '#4caf50',
    'failed': '#ff1744',
    'timed_out': '#ff9800',
    'connection_failed': '#af52bf',
    'waiting': '#aaa'
  }

  React.useEffect(() => {
    if (!scriptRuns?.totalPages) return

    setTotalPages(scriptRuns?.totalPages)
  }, [scriptRuns?.totalPages])


  const handleOpenDial = (scriptRun) => {
    console.log(scriptRun)
    setCurrentRun(scriptRun)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setOpenDial(false)
    setCurrentRun(null)
  }

  const fetchNextUserPage = (event, newPage) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutate({ axiosOptions: { params: newFilterPage } })
  }

  const updateFilters = (newFilter) => {
    const validFilter = Object.fromEntries(
      Object.entries(newFilter).filter(([_, v]) => v !== '')
    )
    validFilter.per = perPage
    validFilter.page = 1

    // console.log(validFilter)
    setFilter(validFilter)
  }


  return (
    <div className='WorkspaceScriptsRuns' style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-wrapper'>
        {!(isLoading || isError) &&
        <List className='List'>
          <Divider />
          {scriptRuns?.runs.length > 0 ?
            scriptRuns?.runs.map((scriptRun, idx) => (
              <div key={idx}>
                <ListItemButton
                  divider
                  onClick={() => handleOpenDial(scriptRun)}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: '16px' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} color={stateColors[scriptRun.state]} />
                    <Typography sx={{ fontSize: '18px' }}>{scriptRun.scriptName}</Typography>
                  </div>
                  <Chip label={scriptRun.state} sx={{ bgcolor: stateColors[scriptRun.state], color: 'white' }} />
                </ListItemButton>
              </div>
            )) :
            <Typography className='no-script-runs'>No script was run yet</Typography>
          }
        </List>
        }
        { totalPages > 1 &&
          <Pagination
            className='WorkspaceScriptsRuns-pagination'
            count={totalPages || 0}
            color='primary'
            onChange={fetchNextUserPage}
            size='large'
            page={filter.page} />
        }

      </div>
      {/* <div className='filter-wrapper'>
        <ScriptRunsFilter
          updateFilters={updateFilters}
        />
      </div> */}
      { currentRun &&
        <Dialog
          open={openDial}
          onClose={handleCloseDial}
          fullWidth
          maxWidth='lg'>
          <div className='dialog-wrapper' style={{ padding: '24px' }}>
            <div className='dialog-header'>
              <Typography variant='h4'>{currentRun.scriptName}</Typography>
              <Typography sx={{ color: stateColors[currentRun.state] }} variant='h5'>
                {currentRun.state}
              </Typography>
              <div className='dialog-script-datetime'>
                <Typography>
                Triggered at: {currentRun.triggeredAt ? dayjs(currentRun.triggeredAt).format('MM/DD/YY HH:MM:ss') : '-'}
                </Typography>
                <Typography>
                Executed at: {currentRun.executedAt ? dayjs(currentRun.executedAt).format('MM/DD/YY HH:MM:ss') : '-'}
                </Typography>
                <Typography>Delay: {currentRun.delay || 0}s</Typography>
              </div>
            </div>
            <div className='dialog-content'>
              <div className='dialog-output'>
                <CodeHighlighter
                  className='dialog-output-line'
                  code={currentRun.input} />
              </div>
              <div className='dialog-output'>
                <CodeHighlighter
                  className='dialog-output-line'
                  code={currentRun.output || 'No output'}
                  plain={true}
                />
              </div>
            </div>
          </div>
        </Dialog>
      }
    </div>
  )
}
