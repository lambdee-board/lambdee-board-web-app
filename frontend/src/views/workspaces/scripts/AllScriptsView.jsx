import * as React from 'react'

import {
  List,
  Typography,
  ListItemButton,
  Divider,
  Pagination
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'


import useWorkspaceScripts from '../../../api/workspace-scripts'

import './AllScriptsView.sass'
import useScriptsPage from '../../../stores/scripts-page'


export default function AllScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [totalPages, setTotalPages] = React.useState(0)
  const per = useScriptsPage((store) => store.per)
  const page = useScriptsPage((store) => store.page)
  const setPage = useScriptsPage((store) => store.setPage)

  const { data: scripts, isLoading, isError, mutate } = useWorkspaceScripts({ axiosOptions: { params: { per, page } } })

  React.useEffect(() => {
    if (!scripts?.totalPages) return

    setTotalPages(scripts?.totalPages)
  }, [scripts?.totalPages])

  const fetchNextUserPage = (event, newPage) => {
    if (page === newPage) return

    setPage(newPage)
    mutate({ axiosOptions: { params: { per, page } } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-wrapper'>
        <List className='List'>
          { !(isLoading || isError) &&
              scripts?.scripts.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => navigate(`/workspaces/${workspaceId}/scripts/${script.id}`)}
                    sx={{ display: 'flex', justifyContent: 'space-between', height: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: '16px' }}>
                      <FontAwesomeIcon icon={faGem} opacity='0.58' />
                      <Typography sx={{ fontSize: '18px' }}>{script.name}</Typography>
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
    </div>
  )
}
