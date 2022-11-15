import * as React from 'react'
import {
  List,
  Typography,
  ListItemButton
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import './WorkspaceScriptsView.sass'

import useWorkspaceScripts from '../../api/useWorkspaceScripts'
import EditScript from '../../components/EditScript'


export default function WorkspaceScriptsView() {
  const { data: scripts, isLoading, isError } = useWorkspaceScripts({})
  const [editing, setEditState] = React.useState(false)
  const [currentScriptData, setCurrentScript] = React.useState({ name: '', description: '', content: '' })

  React.useEffect(() => {
    console.log(scripts)
    if (isLoading || isError) return
    scripts.map((script, idx) => {
      console.log(script)
    })
  }, [isError, isLoading, scripts])

  const openScriptEditing = (script) => {
    setCurrentScript(script)
    setEditState(true)
  }

  const closeScriptEditing = () => {
    setCurrentScript({ name: '', description: '', content: '' })
    setEditState(false)
  }


  return (
    <div className='WorkspaceScripts-wrapper'>
      { editing &&
      <EditScript
        name={currentScriptData.name}
        content={currentScriptData.content}
        description={currentScriptData.description}
        closeFn={closeScriptEditing}
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
