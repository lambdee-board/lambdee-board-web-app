import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Divider, List, ListItemButton, Typography } from '@mui/material'
import * as React from 'react'
import useScriptRuns from '../../../api/script-runs'

import './ScriptRunsView.sass'

export default function ScriptRunsView() {
  const { data: scriptRuns, isLoading, isError } = useScriptRuns({})

  return (
    <div className='WorkspaceScriptsRuns'>
      <div className='list-wrapper'>
        <List className='List'>
          <Divider />
          { !(isLoading || isError) &&
              scriptRuns.map((runs, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    sx={{ fontSize: '32px', gap: '16px' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    <Typography variant='h5'>{runs.state}</Typography>
                  </ListItemButton>
                </div>
              ))}
        </List>
      </div>
    </div>
  )
}
