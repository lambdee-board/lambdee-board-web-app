import * as React from 'react'
import {
  List,
  Button,
  Pagination,
  Typography
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


import WorkspaceUser, { WorkspaceUserSkeleton } from '../../components/workspace-settings/WorkspaceUser'

import './WorkspaceScriptsView.sass'

import useWorkspaceScripts from '../../api/useWorkspaceScripts'


export default function WorkspaceScriptsView() {
  const [filter, setFilter] = React.useState({ page: 1, per: 1 })
  const { data: scripts, isLoading, isError } = useWorkspaceScripts()


  return (
    <div className='WorkspaceMembers-wrapper'>
      <div className='WorkspaceMembers' >
        <div className='list-wrapper'>
          <List className='List'>
            { !(isLoading || isError) ?
              'asd' :
              [...Array(5)].map((val, idx) => {
                return '<WorkspaceScriptsSkeleton key={idx} />'
              })
            }
          </List>
        </div>
      </div>
    </div>
  )
}
