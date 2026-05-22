import * as React from 'react'

import { Box, Divider, List, ListItemButton, Typography, Dialog, Chip, Pagination } from '@mui/material'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useScriptRuns from '../../../api/script-runs'
import CodeHighlighter from '../../../components/CodeHighlighter'
import dayjs from 'dayjs'


interface ScriptRun {
  state: string
  scriptName: string
  triggeredAt: string | null
  executedAt: string | null
  delay: number | null
  input: string
  output: string | null
}

export default function ScriptRunsView() {
  const perPage = 10
  const [filter, setFilter] = React.useState({ page: 1, per: perPage })
  const [totalPages, setTotalPages] = React.useState(0)

  const { data: scriptRuns, isLoading, isError, mutate } = useScriptRuns({ axiosOptions: { params: filter } })
  const [openDial, setOpenDial] = React.useState(false)
  const [currentRun, setCurrentRun] = React.useState<ScriptRun | null>(null)

  const stateColors: Record<string, string> = {
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


  const handleOpenDial = (scriptRun: ScriptRun) => {
    setCurrentRun(scriptRun)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setOpenDial(false)
    setCurrentRun(null)
  }

  const fetchNextUserPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    mutate({ axiosOptions: { params: newFilterPage } } as unknown as undefined)
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%' }}>
        {!(isLoading || isError) &&
        <List>

          {scriptRuns?.runs.length > 0 ?
            scriptRuns?.runs.map((scriptRun, idx) => (
              <div key={idx}>
                <ListItemButton
                  divider
                  onClick={() => handleOpenDial(scriptRun as ScriptRun)}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: 2 }}>
                    <FontAwesomeIcon icon={faCalendarCheck} color={stateColors[(scriptRun as ScriptRun).state]} />
                    <Typography sx={{ fontSize: '18px' }}>{(scriptRun as ScriptRun).scriptName}</Typography>
                    <Divider />
                  </Box>
                  <Chip label={(scriptRun as ScriptRun).state} sx={{ bgcolor: stateColors[(scriptRun as ScriptRun).state], color: 'white' }} />
                </ListItemButton>
              </div>
            )) :
            <Typography sx={{ width: '100%', fontSize: '48px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', color: 'rgba(2, 159, 209, 0.3)' }}>No script was run yet</Typography>
          }
        </List>
        }
        { totalPages > 1 &&
          <Pagination
            sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}
            count={totalPages || 0}
            color='primary'
            onChange={fetchNextUserPage}
            size='large'
            page={filter.page} />
        }

      </div>
      { currentRun &&
        <Dialog
          open={openDial}
          onClose={handleCloseDial}
          fullWidth
          maxWidth='lg'>
          <Box sx={{ p: 3 }}>
            <div>
              <Typography variant='h4'>{currentRun.scriptName}</Typography>
              <Typography sx={{ color: stateColors[currentRun.state] }} variant='h5'>
                {currentRun.state}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography>
                Triggered at: {currentRun.triggeredAt ? dayjs(currentRun.triggeredAt).format('MM/DD/YY HH:mm:ss') : '-'}
                </Typography>
                <Typography>
                Executed at: {currentRun.executedAt ? dayjs(currentRun.executedAt).format('MM/DD/YY HH:mm:ss') : '-'}
                </Typography>
                <Typography>Delay: {currentRun.delay || 0}s</Typography>
              </Box>
            </div>
            <div>
              <Box sx={{ overflowY: 'scroll', overflowX: 'scroll', fontFamily: '"Fira code", "Fira Mono", monospace', backgroundColor: '#032b3a', color: '#fff', borderRadius: '8px', width: 'calc(100% - 24px)', p: 1, height: '350px', my: 1 }}>
                <CodeHighlighter code={currentRun.input} />
              </Box>
              <Box sx={{ overflowY: 'scroll', overflowX: 'scroll', fontFamily: '"Fira code", "Fira Mono", monospace', backgroundColor: '#032b3a', color: '#fff', borderRadius: '8px', width: 'calc(100% - 24px)', p: 1, height: '350px', my: 1 }}>
                <CodeHighlighter
                  code={currentRun.output || 'No output'}
                  plain={true}
                />
              </Box>
            </div>
          </Box>
        </Dialog>
      }
    </div>
  )
}
