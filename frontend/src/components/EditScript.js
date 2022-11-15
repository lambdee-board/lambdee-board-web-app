import * as React from 'react'
import { Button, IconButton, Paper, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faXmark, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'
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

import dateFormat from 'dateformat'
import CodeHighlighter from '../components/CodeHighlighter'
import WebSocketMessage from '../types/WebSocketMessage'

const HISTORY_BUFFER_SIZE = 200
const INPUT_HISTORY_BUFFER_SIZE = HISTORY_BUFFER_SIZE / 2

const ConsolePrompt = () => {
  return (
    <pre style={{ marginTop: 18.4, marginBottom: 18.4 }}>
      {'>>>'}
    </pre>
  )
}

const scrollToBottom = () => {
  const view = document.querySelector('.ConsoleView')
  if (!view) return
  view.scrollTop = view.scrollHeight
}

const getCodeEditor = () => {
  return document.querySelector('.ConsoleView-editor textarea')
}

const focusCodeEditor = () => getCodeEditor()?.focus()

const EditScript = (props) => {
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [consoleHistory, setConsoleHistory] = React.useState([])
  const [consoleInputHistory, setConsoleInputHistory] = React.useState([])
  const [responseReceived, setResponseReceived] = React.useState(false)
  const [selectedHistoryEntry, setSelectedHistoryEntry] = React.useState(0)
  const [codeDraft, setCodeDraft] = React.useState(props.content)

  // onMount
  React.useEffect(() => {
    const addToConsoleHistory = (content) => {
      const entry = {
        type: WebSocketMessage.types.consoleOutput,
        content,
        time: new Date(),
      }
      setConsoleHistory((oldConsoleHistory) => [...oldConsoleHistory.slice(-HISTORY_BUFFER_SIZE), entry])
      setTimeout(() => {
        scrollToBottom()
        focusCodeEditor()
      }, 50)
    }

    const newWebSocket = new WebSocket(`${process.env.WS_PROTOCOL}://${process.env.SCRIPT_SERVICE_HOST}`)
    newWebSocket.onmessage = async(event) => {
      const message = WebSocketMessage.decode(event.data)
      switch (message.type) {
      case WebSocketMessage.types.consoleOutput:
        addToConsoleHistory(message.payload)
        break
      case WebSocketMessage.types.info:
        addToConsoleHistory(message.payload)
        setResponseReceived(true)
        break
      case WebSocketMessage.types.consoleOutputEnd:
        if (message.payload) addToConsoleHistory(message.payload)
        setResponseReceived(true)
        break
      }
    }
    newWebSocket.onclose = (event) => {
      addToConsoleHistory('Session closed.')
    }
    newWebSocket.onopen = () => {
      setWebSocketOpen(true)
      newWebSocket.send(WebSocketMessage.encode(
        WebSocketMessage.types.auth,
        { token: localStorage.getItem('token') }
      ))
    }
    setWebSocket(newWebSocket)

    // cleanup function
    return () => {
      newWebSocket.close()
    }
  }, [])

  const addToConsoleHistory = (content) => {
    const entry = {
      type: WebSocketMessage.types.consoleInput,
      content,
      time: new Date(),
    }
    setConsoleHistory((oldConsoleHistory) => [...oldConsoleHistory.slice(-HISTORY_BUFFER_SIZE), entry])
    setConsoleInputHistory((old) => [...old.slice(-INPUT_HISTORY_BUFFER_SIZE), entry])
    setResponseReceived(false)
    setTimeout(() => {
      scrollToBottom()
    }, 50)
  }

  const sendCode = () => {
    webSocket.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))

    addToConsoleHistory(codeDraft)
    setCodeDraft('')
    setSelectedHistoryEntry(0)
  }

  const editorOnKeyDown = (e) => {
    const codeEditor = getCodeEditor()
    let newSelectedHistoryEntry, lineBreak

    switch (e.key) {
    case 'Enter':
      if (e.shiftKey === true) {
        scrollToBottom()
        return
      }
      e.preventDefault()
      sendCode()
      break
    case 'ArrowUp':
      if (newInputProvided && codeDraft !== '') return
      lineBreak = codeEditor.value.indexOf('\n')

      if (lineBreak !== -1 && codeEditor.selectionStart > lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry - 1 < -consoleInputHistory.length) return

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry - 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content)
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    case 'ArrowDown':
      if (newInputProvided && codeDraft !== '') return
      lineBreak = codeEditor.value.lastIndexOf('\n')

      if (lineBreak !== -1 && codeEditor.selectionStart <= lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry + 1 >= 0) {
        e.preventDefault
        setSelectedHistoryEntry(0)
        setCodeDraft('')
        return
      }

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry + 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content)
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    }
  }

  const updateCode = (val) => {
    setCodeDraft(val)
    if (!newInputProvided) {
      setNewInputProvided(true)
      setSelectedHistoryEntry(0)
    }
  }

  return (
    <div className='EditCard-wrapper'>
      <Paper className='EditCard'>
        <div className='EditCard-content'>
          <div className='EditCard-header'>
            <Typography className='EditCard-scriptName' variant='h4'>
              {props.name}
            </Typography>
            <Typography className='EditCard-scriptDescription' sx={{ color: '#aaa' }}>
              {props.description}
            </Typography>
          </div>

          <Editor
            className='ConsoleView-editor'
            value={codeDraft}
            onValueChange={updateCode}
            highlight={(code) => highlight(code, languages.ruby)}
            padding={10}
            onKeyDown={editorOnKeyDown}
          />


        </div>
        <div className='EditCard-actionBtns'>
          <div className='EditCard-closeWrapper'>
            <IconButton onClick={props.closeFn} className='EditCard-btnClose'>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className='EditCard-scriptBtns'>
            <Button onClick={() => console.log('run')} className='EditCard-btnRun' color='success' startIcon={<FontAwesomeIcon icon={faPlay} />}>
              <Typography>Run</Typography>
            </Button>
            <Button onClick={() => console.log('save')} className='EditCard-btnSave' color='info' startIcon={<FontAwesomeIcon icon={faSave} />}>
              <Typography>Save</Typography>
            </Button>
            <Button onClick={() => console.log('delete')} className='EditCard-btnDelete' color='error' startIcon={<FontAwesomeIcon icon={faTrash} />}>
              <Typography>Delete</Typography>
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}

EditScript.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  closeFn: PropTypes.func.isRequired
}

export default EditScript
