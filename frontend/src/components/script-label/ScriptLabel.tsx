import * as React from 'react'

import { Typography, InputBase } from '@mui/material'

import apiClient from '../../api/axios-client'
import useAppAlertStore from '../../stores/app-alert'
import { mutateScript } from '../../api/script'


interface Props {
  id: number
  text: string
  type?: string
}

const ScriptLabel = ({ id, text, type }: Props) => {
  const descStyle = type !== 'description' ? {} : { fontSize: 18 }
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editScriptLabelButton, setEditScriptLabel] = React.useState(true)

  const toggleEditScriptLabelButton = () => setEditScriptLabel(!editScriptLabelButton)
  const editScriptLabelRef = React.useRef<HTMLDivElement>(null)

  const editScriptLabelOnClick = () => {
    toggleEditScriptLabelButton()
    setTimeout(() => {
      if (!editScriptLabelRef.current) return
      const nameInput = editScriptLabelRef.current.children[0] as HTMLInputElement
      nameInput.focus()
    }, 25)
  }

  const editScriptLabel = () => {
    const newLabel = editScriptLabelRef.current!.children[0] as HTMLInputElement
    if (!newLabel.value || newLabel.value === text) {
      toggleEditScriptLabelButton()
      return
    }

    const updatedScript = type !== 'description' ? { name: newLabel.value } : { description: newLabel.value }
    console.log(updatedScript)
    if (!('name' in updatedScript ? updatedScript.name : updatedScript.description)) {
      setEditScriptLabel(true)
      return
    }

    apiClient.put(`/api/scripts/${id}`, updatedScript)
      .then((response) => {
        mutateScript({
          id,
          data: (currentScript) => (
            type !== 'description' ?
              { ...currentScript, name: response.data.name } :
              { ...currentScript, description: response.data.description }
          ),
          options: { revalidate: false }
        })
        toggleEditScriptLabelButton()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editScriptLabelInputOnKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
    case 'Enter':
      e.preventDefault()
      editScriptLabel()
      break
    case 'Escape':
      e.preventDefault()
      toggleEditScriptLabelButton()
      break
    }
  }
  return (
    <div>
      {editScriptLabelButton ? (
        <Typography
          onClick={editScriptLabelOnClick}
          sx={{ mt: 1, mb: 1.5, fontSize: 28, cursor: 'pointer', '&:hover': { backgroundColor: '#DCDCDC', borderRadius: '8px' }, ...descStyle }}
        >
          {text}
        </Typography>
      ) : (
        <div>
          <InputBase
            ref={editScriptLabelRef}
            fullWidth
            multiline
            defaultValue={text}
            sx={{ fontSize: 28, ...descStyle }}
            onKeyDown={(e) => editScriptLabelInputOnKey(e)}
            onBlur={() => toggleEditScriptLabelButton()}
          />
        </div>
      )}
    </div>
  )
}

export default ScriptLabel
