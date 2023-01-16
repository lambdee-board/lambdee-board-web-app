import * as React from 'react'

import {
  List,
  Typography,
  ListItemButton,
  Divider
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'


import useWorkspaceScripts from '../../../api/workspace-scripts'

import './AllScriptsView.sass'

export default function AllScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { data: scripts, isLoading, isError } = useWorkspaceScripts({})

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-wrapper'>
        <List className='List'>
          { !(isLoading || isError) &&
              scripts?.map((script, idx) => (
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
        </List>
      </div>
    </div>
  )
}
