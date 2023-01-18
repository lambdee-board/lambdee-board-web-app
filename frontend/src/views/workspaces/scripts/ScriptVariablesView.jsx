import * as React from 'react'

import {
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

import './ScriptVariablesView.sass'

export default function ScriptVariablesView() {
  const [totalPages, setTotalPages] = React.useState(0)
  const [openDial, setOpenDial] = React.useState(false)
  const [currentVar, setCurrentVar] = React.useState(null)
  const per = useScriptVariablesPage((store) => store.per)
  const page = useScriptVariablesPage((store) => store.page)
  const setPage = useScriptVariablesPage((store) => store.setPage)

  const { data: scriptVariables, isLoading, isError, mutate } = useScriptVariables({ axiosOptions: { params: { per, page } } })

  React.useEffect(() => {
    if (!scriptVariables?.totalPages) return

    setTotalPages(scriptVariables?.totalPages)
  }, [scriptVariables?.totalPages])

  const fetchNextUserPage = (event, newPage) => {
    if (page === newPage) return

    setPage(newPage)
    mutate({ axiosOptions: { params: { per, page } } })
  }

  const handleOpenDial = (scriptVar) => {
    setCurrentVar(scriptVar)
    setOpenDial(true)
  }
  const handleCloseDial = () => {
    setCurrentVar(null)
    setOpenDial(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-wrapper'>
        <List className='List'>
          { !(isLoading || isError) &&
              scriptVariables?.scriptVariables.map((scriptVariable, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => handleOpenDial(scriptVariable)}
                    sx={{ display: 'flex', justifyContent: 'space-between', height: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: '16px' }}>
                      <FontAwesomeIcon icon={faKey} opacity='0.58' />
                      <Typography sx={{ fontSize: '18px' }}>{scriptVariable.name}</Typography>
                    </div>
                    <Divider />
                  </ListItemButton>
                </div>
              ))}
          { totalPages > 1 &&
          <Pagination
            className='WorkspaceScriptsRuns-pagination'
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
          <div className='dialog-wrapper' style={{ padding: '24px' }}>
            <div className='dialog-header'>
              <Typography variant='h4'>{currentVar.name}</Typography>
              <Typography variant='h5'>
                {currentVar.description}
              </Typography>
              <div className='dialog-script-datetime'>
                <Typography>
                Created at: {currentVar.createdAt ? dayjs(currentVar.createdAt).format('MM/DD/YY HH:MM:ss') : '-'}
                </Typography>
              </div>
            </div>
          </div>
        </Dialog>
      }
    </div>
  )
}
