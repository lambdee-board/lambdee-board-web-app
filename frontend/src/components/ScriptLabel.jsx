import * as React from 'react'
import PropTypes from 'prop-types'

import { Typography, InputBase } from '@mui/material'

import apiClient from '../api/api-client'
import useAppAlertStore from '../stores/app-alert'
import { mutateScript } from '../api/script'

import './ScriptLabel.sass'

const ScriptLabel = (props) => {
  const descStyle = props.type !== 'description' ? {} : { fontSize: 18 }
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [editScriptLabelButton, setEditScriptLabel] = React.useState(true)

  const toggleEditScriptLabelButton = () => setEditScriptLabel(!editScriptLabelButton)
  const editScriptLabelRef = React.useRef()

  const editScriptLabelOnClick = () => {
    toggleEditScriptLabelButton()
    setTimeout(() => {
      if (!editScriptLabelRef.current) return
      const nameInput = editScriptLabelRef.current.children[0]
      nameInput.focus()
    }, 25)
  }

  const editScriptLabel = () => {
    const newLabel = editScriptLabelRef.current.children[0]
    if (!newLabel.value || newLabel.value === props.text) {
      toggleEditScriptLabelButton()
      return
    }

    const updatedScript = props.type !== 'description' ? { name: newLabel.value } : { description: newLabel.value }
    console.log(updatedScript)
    if (!updatedScript.name && !updatedScript.description) {
      setEditScriptLabel(true)
      return
    }

    apiClient.put(`/api/scripts/${props.id}`, updatedScript)
      .then((response) => {
        // successful request
        mutateScript({
          id: props.id,
          data: (currentScript) => (
            props.type !== 'description' ?
              { ...currentScript, name: response.data.name } :
              { ...currentScript, description: response.data.description }
          ),
          options: { revalidate: false }
        })
        toggleEditScriptLabelButton()
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const editScriptLabelInputOnKey = (e) => {
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
          className='Script-Label'
          onClick={editScriptLabelOnClick}
          sx={{ mt: '8px', mb: '12px', fontSize: 28, ...descStyle }}
        >
          {props.text}
        </Typography>
      ) : (
        <div>
          <InputBase
            ref={editScriptLabelRef}
            fullWidth
            multiline
            defaultValue={props.text}
            sx={{ fontSize: 28, ...descStyle }}
            onKeyDown={(e) => editScriptLabelInputOnKey(e)}
            onBlur={(e) => toggleEditScriptLabelButton()}
          />
        </div>
      )}
    </div>
  )
}

export default ScriptLabel

ScriptLabel.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string
}


