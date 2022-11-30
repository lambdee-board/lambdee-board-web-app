import * as React from 'react'

import {
  List,
  Typography,
  ListItemButton
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScroll } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'

import useWorkspaceScripts from '../../api/workspace-scripts'

import './WorkspaceScriptsView.sass'

export default function WorkspaceScriptsView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { data: scripts, isLoading, isError } = useWorkspaceScripts({})

  return (
    <div className='WorkspaceScripts-wrapper'>
      <div className='WorkspaceScripts'>
        <div className='list-wrapper'>
          <List className='List'>
            { !(isLoading || isError) &&
              scripts.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => navigate(`/workspaces/${workspaceId}/scripts/${script.id}`)}
                    sx={{ fontSize: '32px', gap: '16px' }}
                  >
                    <FontAwesomeIcon icon={faScroll} />
                    <Typography variant='h5'>{script.name}</Typography>
                  </ListItemButton>
                </div>
              ))
            }
          </List>
        </div>
      </div>
    </div>
  )
}
