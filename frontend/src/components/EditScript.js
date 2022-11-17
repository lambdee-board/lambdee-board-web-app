import * as React from 'react'
import { Button, IconButton, Paper, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faXmark, faSave, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { languages, highlight } from 'prismjs/components/prism-core'

import PropTypes from 'prop-types'
import './EditScript.sass'

import Editor from 'react-simple-code-editor'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import CodeHighlighter from '../components/CodeHighlighter'
import WebSocketMessage from '../types/WebSocketMessage'
import apiClient from '../api/apiClient'
import { useDispatch } from 'react-redux'
import { addAlert } from '../redux/slices/appAlertSlice'

const HISTORY_BUFFER_SIZE = 200

const scrollToBottom = () => {
  const view = document.querySelector('.EditCard-output')
  if (!view) return
  view.scrollTop = view.scrollHeight
}

const EditScript = (props) => {
  const dispatch = useDispatch()
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [codeDraft, setCodeDraft] = React.useState(props.script.content)
  const [outputHistory, setOutputHistory] = React.useState([
    {
      type: WebSocketMessage.types.consoleOutput,
      content: 'Run script to see logs.',
      time: new Date(),
    }
  ])


  React.useEffect(() => {
    if (!webSocket || !webSocketOpen) return
    webSocket.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))
  }, [codeDraft, webSocket, webSocketOpen])


  const openWsConnection = () => {
    const newWebSocket = new WebSocket(`${process.env.SCRIPT_SERVICE_WS_PROTOCOL}://${process.env.SCRIPT_SERVICE_EXTERNAL_HOST}`)
    newWebSocket.onmessage = async(event) => {
      const message = WebSocketMessage.decode(event.data)
      switch (message.type) {
      case WebSocketMessage.types.consoleOutput:
        addToOutputHistory(message.payload)
        break
      case WebSocketMessage.types.info:
        addToOutputHistory(message.payload)
        break
      case WebSocketMessage.types.consoleOutputEnd:
        if (message.payload) addToOutputHistory(message.payload)
        newWebSocket.close()
        break
      }
    }
    newWebSocket.onclose = (event) => {
      addToOutputHistory('Session closed.')
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

  const updateCode = (val) => {
    setCodeDraft(val)
    if (!newInputProvided) {
      setNewInputProvided(true)
    }
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
            <Button onClick={saveScript} className='EditCard-btnSave' color='info' fullWidth startIcon={<FontAwesomeIcon icon={faSave} />}>
              <Typography>Save</Typography>
            </Button>
            <Button onClick={() => console.log('delete')} className='EditCard-btnDelete' color='error' fullWidth startIcon={<FontAwesomeIcon icon={faTrash} />}>
              <Typography>Delete</Typography>
            </Button>

            <Button onClick={() => console.log('Create trigger')} className='EditCard-btnAddTrigger' color='secondary' fullWidth startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Trigger</Typography>
            </Button>
          </div>
          <Typography variant='h5'>Active triggers</Typography>
        </div>
      </Paper>
    </div>
  )
}

EditScript.propTypes = {
  script: PropTypes.object.isRequired,
  closeFn: PropTypes.func.isRequired,
  mutateScript: PropTypes.func.isRequired
}

export default EditScript
