import * as React from 'react'
import {
  List,
  Typography,
  ListItemButton
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faScroll } from '@fortawesome/free-solid-svg-icons'

import './WorkspaceScriptsView.sass'

import useWorkspaceScripts from '../../api/useWorkspaceScripts'
import EditScript from '../../components/EditScript'
import useScriptRuns from '../../api/useScriptRuns'


export default function WorkspaceScriptsView() {
  const { data: scripts, isLoading, isError, mutate } = useWorkspaceScripts({})
  const { data: scriptRuns, isLoadingSR, isErrorSR } = useScriptRuns({})
  const [editing, setEditState] = React.useState(false)
  const [currentScript, setCurrentScript] = React.useState(null)

  const openScriptEditing = (script) => {
    setCurrentScript(script)
    setEditState(true)
  }

  const closeScriptEditing = () => {
    setCurrentScript(null)
    setEditState(false)
  }

  const mutateScript = (script) => {
    mutate([ script, ...scripts ])
  }

  return (
    <div className='WorkspaceScripts-wrapper'>
      { editing &&
      <EditScript
        script={currentScript}
        closeFn={closeScriptEditing}
        mutateScript={mutateScript}
      /> }
      <div className='WorkspaceScripts'>
        <div className='list-wrapper'>
          <Typography sx={{ paddingLeft: '16px' }}>Scrips</Typography>
          <List className='List'>
            { !(isLoading || isError) &&
              scripts.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => openScriptEditing(script)}
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
        <div className='list-wrapper'>
          <Typography sx={{ paddingLeft: '16px' }}>Script Runs</Typography>
          <List className='List'>
            { !(isLoadingSR || isErrorSR) &&
              scriptRuns?.map((run, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => {}}
                    sx={{ fontSize: '32px', gap: '16px' }}
                  >
                    <FontAwesomeIcon icon={faHistory} />
                    <Typography variant='h5'>{run.state}</Typography>
                    <Typography variant='pre'>{run.output}</Typography>
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
