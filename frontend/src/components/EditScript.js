import * as React from 'react'
import { Button, Divider, IconButton, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faXmark, faSave, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { languages, highlight } from 'prismjs/components/prism-core'

import PropTypes from 'prop-types'
import './EditScript.sass'

import Editor from 'react-simple-code-editor'
import { useDispatch } from 'react-redux'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import CodeHighlighter from '../components/CodeHighlighter'
import WebSocketMessage from '../types/WebSocketMessage'
import apiClient from '../api/apiClient'
import { addAlert } from '../redux/slices/appAlertSlice'
import ScriptTriggerDialog from './ScriptTriggerDialog'
import useScript from '../api/useScript'
import { takeUntil } from '../utils/takeUntil'

const HISTORY_BUFFER_SIZE = 200

const scrollToBottom = () => {
  const view = document.querySelector('.EditCard-output')
  if (!view) return
  view.scrollTop = view.scrollHeight
}

const EditScript = (props) => {
  const { data: script, isLoading, isError, mutate } = useScript({ id: props.script.id })
  const dispatch = useDispatch()
  const [openDial, setOpenDial] = React.useState(false)
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [codeDraft, setCodeDraft] = React.useState(props.script.content)
  const [outputHistory, setOutputHistory] = React.useState([{
    type: WebSocketMessage.types.consoleOutput,
    content: '# Run script to see logs.',
    time: new Date(),
  }])


  React.useEffect(() => {
    if (!webSocket || !webSocketOpen) return
    webSocket.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))
  }, [codeDraft, webSocket, webSocketOpen])


  const openWsConnection = () => {
    resetOutputHistory()
    const newWebSocket = new WebSocket(`${process.env.SCRIPT_SERVICE_WS_PROTOCOL}://${process.env.SCRIPT_SERVICE_EXTERNAL_HOST}`)
    newWebSocket.onmessage = async(event) => {
      const message = WebSocketMessage.decode(event.data)
      switch (message.type) {
      case WebSocketMessage.types.consoleOutput:
        addToOutputHistory(message.payload)
        break
      // case WebSocketMessage.types.info:
      //   addToOutputHistory(message.payload)
      //   break
      case WebSocketMessage.types.consoleOutputEnd:
        if (message.payload) addToOutputHistory(message.payload)
        newWebSocket.close()
        break
      }
    }
    newWebSocket.onclose = (event) => {
      addToOutputHistory('# Session closed.')
      setWebSocketOpen(false)
      setWebSocket(null)
    }
    newWebSocket.onopen = () => {
      setWebSocketOpen(true)
      newWebSocket.send(WebSocketMessage.encode(
        WebSocketMessage.types.auth,
        { token: localStorage.getItem('token') }
      ))
    }
    setWebSocket(newWebSocket)
  }

  const addToOutputHistory = (content) => {
    // TODO: create a second websocket endpoint for scripts
    // which doesn't use IRB
    if (content) content = takeUntil(content.split('\n'), (line) => line.match(/^ {2}=>/)).join('\n')

    const entry = {
      type: WebSocketMessage.types.consoleOutput,
      content,
      time: new Date(),
    }
    setOutputHistory((oldOutputHistory) => [...oldOutputHistory.slice(-HISTORY_BUFFER_SIZE), entry])
    setTimeout(() => {
      scrollToBottom()
    }, 50)
  }

  const resetOutputHistory = () => {
    setOutputHistory([])
  }

  const updateCode = (val) => {
    setCodeDraft(val)
    if (!newInputProvided) {
      setNewInputProvided(true)
    }
  }

  const handleCloseDial = () => {
    setOpenDial(false)
  }

  const handleOpenDial = () => {
    setOpenDial(true)
  }

  const handleSubmit = (event, trigger) => {
    event.preventDefault()
    saveTrigger(trigger)
    handleCloseDial()
  }

  const saveScript = () => {
    const payload = {
      ...props.script,
      content: codeDraft
    }

    apiClient.put(`/api/scripts/${props.script.id}`, payload)
      .then((response) => {
        // successful request
        props.mutateScript(payload)
        setNewInputProvided(false)
        dispatch(addAlert({ severity: 'success', message: 'Script saved' }))
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const saveTrigger = (trigger) => {
    const payload = {
      scriptId: props.script.id,
      ...trigger
    }

    apiClient.post('/api/script_triggers', payload)
      .then((response) => {
        // successful request
        mutate([...script.scriptTriggers, trigger])
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const deleteTrigger = (triggerId) => {
    apiClient.delete(`/api/script_triggers/${triggerId}`)
      .then((response) => {
        // successful request
        mutate({ id: props.script.id,
          data: { ...script, scriptTriggers: [script.scriptTriggers.filter((trigger) => trigger.id !== triggerId)] } })
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  return (
    <div className='EditCard-wrapper'>
      <Paper className='EditCard'>
        <div className='EditCard-content'>
          <div className='EditCard-header'>
            <Typography className='EditCard-scriptName' variant='h4'>
              {props.script.name}
            </Typography>
            <Typography className='EditCard-scriptDescription' sx={{ color: '#aaa' }}>
              {props.script.description}
            </Typography>
          </div>

          <Editor
            className='EditCard-editor'
            value={codeDraft}
            onValueChange={updateCode}
            highlight={(code) => highlight(code, languages.ruby)}
            padding={10}
          />


          <Typography variant='h5'>Logs</Typography>
          <div className='EditCard-output'>
            {outputHistory.map((interaction, index) => {
              return (<div key={index}>
                <CodeHighlighter className='EditCard-outputLine' code={interaction.content} />
              </div>)
            })}
          </div>

        </div>
        <div className='EditCard-actionBtns'>
          <div className='EditCard-closeWrapper'>
            <IconButton onClick={props.closeFn} className='EditCard-btnClose'>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className='EditCard-scriptBtns'>
            <Button onClick={openWsConnection} className='EditCard-btnRun' color='success' fullWidth startIcon={<FontAwesomeIcon icon={faPlay} />}>
              <Typography>Run</Typography>
            </Button>
            <Button onClick={saveScript} className='EditCard-btnSave' color='info' disabled={!newInputProvided} fullWidth startIcon={<FontAwesomeIcon icon={faSave} />}>
              <Typography>Save</Typography>
            </Button>
            <Button onClick={() => console.log('delete')} className='EditCard-btnDelete' color='error' fullWidth startIcon={<FontAwesomeIcon icon={faTrash} />}>
              <Typography>Delete</Typography>
            </Button>

            <Button onClick={handleOpenDial} className='EditCard-btnAddTrigger' color='secondary' fullWidth startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Trigger</Typography>
            </Button>
          </div>
          <div>
            <Typography variant='h5'>Active triggers</Typography>
            {!(isLoading || isError) &&
              <List>
                {script?.scriptTriggers?.map((trigger, idx) => (
                  <div key={`trigger-${idx}`}>
                    <Divider />
                    <ListItem
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      secondaryAction={
                        <IconButton edge='end' onClick={() => deleteTrigger(trigger.id)} color='error'>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={`Action: ${trigger.action}`} />
                      <ListItemText
                        primary={`Type: ${trigger.subjectType}`}
                        secondary={`Id: ${trigger.subjectId}`} />
                    </ListItem>
                  </div>
                ))}
              </List>
            }
          </div>
        </div>
      </Paper>
      <ScriptTriggerDialog
        openDial={openDial}
        handleCloseDial={handleCloseDial}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

EditScript.propTypes = {
  script: PropTypes.object.isRequired,
  closeFn: PropTypes.func.isRequired,
  mutateScript: PropTypes.func.isRequired
}

export default EditScript
