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


import useWorkspaceScripts from '../../../../api/workspace-scripts'

import './../AllScriptsView.sass'

export default function EditScriptTriggersView() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { data: scripts, isLoading, isError } = useWorkspaceScripts({})

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-wrapper'>
      </div>
    </div>
  )
}
