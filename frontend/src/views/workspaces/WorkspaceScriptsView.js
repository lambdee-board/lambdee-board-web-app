import * as React from 'react'
import {
  List,
  Typography,
  ListItemButton
} from '@mui/material'

import './WorkspaceScriptsView.sass'

import useWorkspaceScripts from '../../api/useWorkspaceScripts'
import EditScript from '../../components/EditScript'


export default function WorkspaceScriptsView() {
  const { data: scripts, isLoading, isError, mutate } = useWorkspaceScripts({})
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
          <List className='List'>
            { !(isLoading || isError) ?
              scripts.map((script, idx) => (
                <div key={idx}>
                  <ListItemButton
                    divider
                    onClick={() => openScriptEditing(script)}
                  >
                    <Typography>Name: {script.name}</Typography>
                  </ListItemButton>
                </div>
              )) :
              [...Array(5)].map((_, idx) => {
                return 'Załadunek jest prowadzony'
              })
            }
          </List>
        </div>
      </div>
    </div>
  )
}
