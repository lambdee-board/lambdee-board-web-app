import * as React from 'react'
import { languages, highlight } from 'prismjs/components/prism-core'

import Editor from 'react-simple-code-editor'
import { Button, Divider, Typography, Card, Modal, Box } from '@mui/material'
import { faPlay, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useAppAlertStore from '../../../../stores/app-alert'
import WebSocketMessage from '../../../../internal/web-socket-message'
import apiClient from '../../../../api/api-client'
import useScript from '../../../../api/script'
import { takeUntil } from '../../../../utils/take-until'

import CodeHighlighter from '../../../../components/CodeHighlighter'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import { useNavigate, useParams } from 'react-router-dom'
import { mutateWorkspaceScripts } from '../../../../api/workspace-scripts'
import CustomAlert from '../../../../components/CustomAlert'

const HISTORY_BUFFER_SIZE = 200

const scrollToBottom = () => {
  const view = document.querySelector('.EditCard-output')
  if (!view) return
  view.scrollTop = view.scrollHeight
}


export default function EditScriptCodeView() {
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { scriptId, workspaceId } = useParams()
  const { data: script, isLoading, isError, mutate } = useScript({ id: scriptId })
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [codeDraft, setCodeDraft] = React.useState('')
  const [alertModalState, setAlertModalState] = React.useState(false)

  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const [outputHistory, setOutputHistory] = React.useState([{
    type: WebSocketMessage.types.consoleOutput,
    content: '# Run script to see logs',
    time: new Date(),
  }])
  React.useEffect(() => {
    if (!webSocket || !webSocketOpen) return
    webSocket.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))
  }, [codeDraft, webSocket, webSocketOpen])

  React.useEffect(() => {
    if (!(isLoading || isError)) setCodeDraft(script.content)
  }, [isLoading, isError, script?.content])

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
  const saveScript = () => {
    const payload = {
      content: codeDraft
    }

    apiClient.put(`/api/scripts/${script.id}`, payload)
      .then((response) => {
        // successful request
        setNewInputProvided(false)
        mutate({ ...script, content: codeDraft })
        addAlert({ severity: 'success', message: 'Script saved' })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteScript = () => {
    apiClient.delete(`/api/scripts/${script.id}`)
      .then((response) => {
        // successful request
        addAlert({ severity: 'success', message: 'Script deleted' })
        toggleAlertModalState()
        mutateWorkspaceScripts({})
        navigate(`/workspaces/${workspaceId}/scripts`)
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  return (
    <div>
      <Modal
        open={alertModalState}
        onClose={toggleAlertModalState}
      >
        <Box
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <CustomAlert confirmAction={deleteScript}
            dismissAction={() => {
              toggleAlertModalState()
            }}
            title='Delete Script?'
            message={`Are you sure you want to delete script ${script.name}`}
            confirmMessage='Confirm, delete script' />
        </Box>
      </Modal>
      <Divider>Code</Divider>
      <div className='EditCard-scriptBtns'>
        <Card sx={{ display: 'flex', flexDirection: 'row', borderRadius: '0', width: '280px'  }}>
          <Button
            onClick={openWsConnection}
            className='EditCard-btnRun'
            color='success'
            fullWidth
            startIcon={<FontAwesomeIcon icon={faPlay} />}>
            <Typography>Run</Typography>
          </Button>
          <Button
            onClick={saveScript}
            className='EditCard-btnSave'
            color='info'
            disabled={!newInputProvided}
            fullWidth
            startIcon={<FontAwesomeIcon icon={faSave} />}>
            <Typography>Save</Typography>
          </Button>
          <Button
            onClick={toggleAlertModalState}
            className='EditCard-btnDelete'
            color='error'
            fullWidth
            startIcon={<FontAwesomeIcon icon={faTrash} />}>
            <Typography>Delete</Typography>
          </Button>
        </Card>
      </div>
      <div></div>
      <div className='EditCard-editor-wrapper'>
        <Editor
          className='EditCard-editor'
          value={codeDraft}
          onValueChange={updateCode}
          highlight={(code) => highlight(code, languages.ruby)}
          padding={10}
        />
      </div>
      <Divider>Logs</Divider>
      <div className='EditCard-output'>
        {outputHistory.map((interaction, index) => {
          return (<div key={index}>
            <CodeHighlighter className='EditCard-outputLine' code={interaction.content} />
          </div>)
        })}
      </div>
    </div>
  )
}
