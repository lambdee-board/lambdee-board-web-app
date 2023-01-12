import * as React from 'react'
import { languages, highlight } from 'prismjs/components/prism-core'

import Editor from 'react-simple-code-editor'
import { Button, Divider, IconButton, List, ListItem, ListItemText, Paper, Skeleton, Typography } from '@mui/material'
import { faPlay, faXmark, faSave, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useAppAlertStore from '../../../stores/app-alert'
import WebSocketMessage from '../../../internal/web-socket-message'
import apiClient from '../../../api/api-client'
import useScript from '../../../api/script'
import { takeUntil } from '../../../utils/take-until'

import CodeHighlighter from '../../../components/CodeHighlighter'
import ScriptTriggerDialog from '../../../components/ScriptTriggerDialog'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import './EditScriptView.sass'
import { useNavigate, useParams } from 'react-router-dom'
import { mutateWorkspaceScripts } from '../../../api/workspace-scripts'
import ScriptLabel from '../../../components/ScriptLabel'

const HISTORY_BUFFER_SIZE = 200

const scrollToBottom = () => {
  const view = document.querySelector('.EditCard-output')
  if (!view) return
  view.scrollTop = view.scrollHeight
}

const EditScriptSkeleton = () => (
  <div className='EditCard-wrapper'>
    <Paper className='EditCard'>
      <div className='EditCard-content'>
        <div className='EditCard-header'>
          <Skeleton variant='rectangular' width={480} height={40} sx={{ mb: '8px' }} />
          <Skeleton variant='rectangular' width={210} height={32} sx={{ mb: '8px' }} />
        </div>
        <div className='EditCard-output'>
          <CodeHighlighter className='EditCard-outputLine' code='' />
        </div>

        <Skeleton variant='rectangular' width={480} height={40} sx={{ mb: '8px' }} />
        <div className='EditCard-output'>
          <CodeHighlighter className='EditCard-outputLine' code='' />
        </div>

      </div>
      <div className='EditCard-actionBtns'>
        <div className='EditCard-closeWrapper'>
          <IconButton disabled>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
        <div className='EditCard-scriptBtns'>
          <Button disabled fullWidth startIcon={<FontAwesomeIcon icon={faPlay} />}>
            <Typography>Run</Typography>
          </Button>
          <Button disabled fullWidth startIcon={<FontAwesomeIcon icon={faSave} />}>
            <Typography>Save</Typography>
          </Button>
          <Button disabled fullWidth startIcon={<FontAwesomeIcon icon={faTrash} />}>
            <Typography>Delete</Typography>
          </Button>
          <Button disabled fullWidth startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>New Trigger</Typography>
          </Button>
        </div>
      </div>
    </Paper>
  </div>
)


const EditScriptView = () => {
  const navigate = useNavigate()
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { scriptId, workspaceId } = useParams()
  const { data: script, isLoading, isError, mutate } = useScript({ id: scriptId })
  const [openDial, setOpenDial] = React.useState(false)
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [codeDraft, setCodeDraft] = React.useState('')
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

  const handleCloseDial = () => {
    setOpenDial(false)
  }

  const handleOpenDial = () => {
    setOpenDial(true)
  }

  const differentiateTrigger = (triggerType, trigger) => {
    switch (triggerType) {
    case 'callback':
      saveTrigger(triggerType, trigger, '/api/script_triggers')
      break
    case 'ui':
      if (trigger.subjectType === 'Global') {
        trigger.subjectType = trigger.subjectType = ''
      }
      saveTrigger(triggerType, trigger, '/api/ui_script_triggers')
      break
    case 'schedule':
      saveTrigger(triggerType, trigger, '/api/schedule_script_triggers')
    }
  }

  const handleSubmit = (triggerType, trigger) => {
    differentiateTrigger(triggerType, trigger)
    handleCloseDial()
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
        mutateWorkspaceScripts({})
        navigate(`/workspaces/${workspaceId}/scripts`)
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const saveTrigger = (type, trigger, path) => {
    const clearedTrigger = Object.fromEntries(Object.entries(trigger).filter(([_, v]) => v !== ''))

    const payload = {
      authorId: parseInt(localStorage.getItem('id')),
      scriptId: script.id,
      ...clearedTrigger
    }
    console.log(path, payload)
    apiClient.post(path, payload)
      .then((response) => {
        // successful request
        switch (type) {
        case 'callback':
          mutate({ ...script, scriptTriggers: [...script.scriptTriggers, response.data] }, { revalidate: false })
          break
        case 'ui':
          mutate({ ...script, uiScriptTriggers: [...script.uiScriptTriggers, response.data] }, { revalidate: false })
          break
        case 'schedule':
          break
        }
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const deleteTrigger = (triggerType, triggerId) => {
    apiClient.delete(`/api/${triggerType}/${triggerId}`)
      .then((response) => {
        // successful request
        switch (triggerType) {
        case 'script_triggers':
          mutate({ ...script, scriptTriggers: [...script.scriptTriggers.filter((trigger) => trigger.id !== triggerId)] }, { revalidate: false })
          break
        case 'ui_script_triggers':
          mutate({ ...script, uiScriptTriggers: [...script.uiScriptTriggers.filter((trigger) => trigger.id !== triggerId)] }, { revalidate: false })
          break
        case 'schedule_script_triggers':
          break
        }
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  if (isLoading || isError) return (<EditScriptSkeleton />)

  return (
    <div className='EditCard-wrapper'>
      <Paper className='EditCard'>
        <div className='EditCard-content'>
          <div className='EditCard-header'>
            <ScriptLabel id={script.id} text={script.name} />
            <ScriptLabel id={script.id} text={script.description} type='description' />
          </div>

          <div className='EditCard-editor-wrapper'>
            <Editor
              className='EditCard-editor'
              value={codeDraft}
              onValueChange={updateCode}
              highlight={(code) => highlight(code, languages.ruby)}
              padding={10}
            />
          </div>

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
            <IconButton
              onClick={() => navigate(`/workspaces/${workspaceId}/scripts/all`)}
              className='EditCard-btnClose'>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className='EditCard-scriptBtns'>
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
              onClick={deleteScript}
              className='EditCard-btnDelete'
              color='error'
              fullWidth
              startIcon={<FontAwesomeIcon icon={faTrash} />}>
              <Typography>Delete</Typography>
            </Button>

            <Button
              onClick={handleOpenDial}
              className='EditCard-btnAddTrigger'
              color='secondary'
              fullWidth
              startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Trigger</Typography>
            </Button>
          </div>
          <div>
            <Typography variant='h4'>Active triggers</Typography>
            {!(isLoading || isError) &&
              <List>
                <ListItem>
                  <Typography variant='h5'>Callback triggers</Typography>
                </ListItem>
                {script?.scriptTriggers?.map((trigger, idx) => (
                  <div key={`trigger-${idx}`}>
                    <Divider />
                    <ListItem
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      secondaryAction={
                        <IconButton
                          edge='end'
                          onClick={() => deleteTrigger('script_triggers', trigger.id)}
                          color='error'>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`Action: ${trigger.action}`}
                        secondary={`Delay: ${trigger.delay || 0}`} />
                      <ListItemText
                        primary={`Type: ${trigger.subjectType || 'all'}`}
                        secondary={`Id: ${trigger.subjectId}`} />
                    </ListItem>
                  </div>
                ))}

                <Divider />
                <ListItem>
                  <Typography variant='h5'>UI triggers</Typography>
                </ListItem>
                {script?.uiScriptTriggers?.map((uiTrigger, idx) => (
                  <div key={`ui-trigger-${idx}`}>
                    <Divider />
                    <ListItem
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                      secondaryAction={
                        <IconButton
                          edge='end'
                          onClick={() => deleteTrigger('ui_script_triggers', uiTrigger.id)}
                          color='error'>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`Private: ${uiTrigger.private}`}
                        secondary={`Delay: ${uiTrigger.delay || 0}`} />
                      <ListItemText
                        primary={`Subject type: ${uiTrigger.subjectType || 'all'}`}
                        secondary={`Subject Id: ${uiTrigger.subjectId}`} />
                      <ListItemText
                        primary={`Scope type: ${uiTrigger.scopeType || 'all'}`}
                        secondary={`Scope Id: ${uiTrigger.scopeId}`} />
                      <ListItemText
                        primary={`Text: ${uiTrigger.text || 'none'}`}
                        secondary={`Colour: ${uiTrigger.colour}`} />
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

export default EditScriptView
