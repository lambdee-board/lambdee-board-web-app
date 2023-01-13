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
    <div className='WorkspaceScripts' style={{ height: '100%', overflow: 'scroll' }}>
      <div className='list-wrapper'>
        <List className='List'>
          <Divider />
          { !(isLoading || isError) &&
              scripts?.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => navigate(`/workspaces/${workspaceId}/scripts/${script.id}`)}
                    sx={{ height: '49px', fontSize: '24px', gap: '16px' }}>
                    <FontAwesomeIcon icon={faGem} opacity='0.58' />
                    <Typography sx={{ fontSize: '18px' }}>{script.name}</Typography>
                  </ListItemButton>
                </div>
              ))}
        </List>
      </div>
    </div>
  )
}
