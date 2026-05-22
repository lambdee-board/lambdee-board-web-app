import * as React from 'react'

import {
  Box,
  List,
  Typography,
  ListItemButton,
  Divider,
  Pagination
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'


import useWorkspaceScripts from '../../../../api/workspace-scripts'


import useScriptsPage from '../../../../stores/scripts-page'


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

  const fetchNextUserPage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (page === newPage) return

    setPage(newPage)
    mutate({ axiosOptions: { params: { per, page } } } as unknown as undefined)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '100%' }}>
        <List>
          { !(isLoading || isError) &&
              scripts?.scripts.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => navigate(`/workspaces/${workspaceId}/scripts/${script.id}`)}
                    sx={{ display: 'flex', justifyContent: 'space-between', height: '48px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '24px', gap: 2 }}>
                      <FontAwesomeIcon icon={faGem} opacity='0.58' />
                      <Typography sx={{ fontSize: '18px' }}>{script.name}</Typography>
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
    </div>
  )
}
