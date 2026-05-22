import * as React from 'react'

import {
  Box,
  List,
  Typography,
  ListItemButton,
  Divider,
  Pagination,
  Dialog
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'

import useScriptVariables from '../../../api/script-variables'
import useScriptVariablesPage from '../../../stores/script-variables-page'


interface ScriptVariable {
  name: string
  description: string
  createdAt: string | null
}

export default function ScriptVariablesView() {
  const [totalPages, setTotalPages] = React.useState(0)
  const [openDial, setOpenDial] = React.useState(false)
  const [currentVar, setCurrentVar] = React.useState<ScriptVariable | null>(null)
  const per = useScriptVariablesPage((store) => store.per)
  const page = useScriptVariablesPage((store) => store.page)
  const setPage = useScriptVariablesPage((store) => store.setPage)

  const { data: scriptVariables, isLoading, isError, mutate } = useScriptVariables({ axiosOptions: { params: { per, page } } })

  React.useEffect(() => {
    if (!scriptVariables?.totalPages) return

    setTotalPages(scriptVariables?.totalPages)
  }, [scriptVariables?.totalPages])

  const fetchNextUserPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (page === newPage) return

    setPage(newPage)
    mutate({ axiosOptions: { params: { per, page } } } as unknown as undefined)
  }

  const handleOpenDial = (scriptVar: ScriptVariable) => {
    setCurrentVar(scriptVar)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setCurrentVar(null)
    setOpenDial(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%' }}>
        <List>
          { !(isLoading || isError) &&
              scriptVariables?.scriptVariables.map((scriptVariable, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => handleOpenDial(scriptVariable as ScriptVariable)}
                    sx={{ display: 'flex', justifyContent: 'space-between', height: '48px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: 2 }}>
                      <FontAwesomeIcon icon={faKey} opacity='0.58' />
                      <Typography sx={{ fontSize: '18px' }}>{(scriptVariable as ScriptVariable).name}</Typography>
                    </Box>
                    <Divider />
                  </ListItemButton>
                </div>
              ))}
          { totalPages > 1 &&
          <Pagination
            sx={{ pt: 1, display: 'flex', justifyContent: 'center' }}
            count={totalPages || 0}
            color='primary'
            onChange={fetchNextUserPage}
            size='large'
            page={page} />
          }
        </List>

      </div>
      { currentVar &&
        <Dialog
          open={openDial}
          onClose={handleCloseDial}
          maxWidth='lg'>
          <Box sx={{ p: 3 }}>
            <div>
              <Typography variant='h4'>{currentVar.name}</Typography>
              <Typography variant='h5'>
                {currentVar.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography>
                Created at: {currentVar.createdAt ? dayjs(currentVar.createdAt).format('MM/DD/YY HH:mm:ss') : '-'}
                </Typography>
              </Box>
            </div>
          </Box>
        </Dialog>
      }
    </div>
  )
}
