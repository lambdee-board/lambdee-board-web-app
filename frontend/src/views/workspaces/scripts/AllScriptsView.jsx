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
import useAllScriptsFilter from '../../../stores/allscripts-filter'


export default function AllScriptsView() {
  const { workspaceId } = useParams()
  const perPage = 10
  const navigate = useNavigate()
  const [filter, setFilter] = React.useState({ page: 1, per: perPage })
  const [totalPages, setTotalPages] = React.useState(0)
  const { data: scripts, isLoading, isError, mutate } = useWorkspaceScripts({ axiosOptions: { params: filter } })
  const setAllScriptsFilter = useAllScriptsFilter((store) => store.setFilter)

  React.useEffect(() => {
    if (!scripts?.totalPages) return

    setTotalPages(scripts?.totalPages)
  }, [scripts?.totalPages])

  const fetchNextUserPage = (event, newPage) => {
    if (filter.page === newPage) return

    const newFilterPage = { ...filter, page: newPage }
    setFilter(newFilterPage)
    setAllScriptsFilter(newFilterPage)
    mutate({ axiosOptions: { params: newFilterPage } })
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
            page={filter.page} />
          }
        </List>

      </div>
    </div>
  )
}
