import * as React from 'react'
import { languages, highlight } from 'prismjs/components/prism-core'

import Editor from 'react-simple-code-editor'
import { Button, Divider, IconButton, List, ListItem, ListItemText, Paper, Skeleton, Typography, Card } from '@mui/material'
import { faPlay, faXmark, faSave, faTrash, faPlus, faCode, faLink } from '@fortawesome/free-solid-svg-icons'
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
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { mutateWorkspaceScripts } from '../../../api/workspace-scripts'
import ScriptLabel from '../../../components/ScriptLabel'
import useCookie from 'react-use-cookie'

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
  const [scriptView, setScriptView] = useCookie('showEditScript', 'code')

  React.useEffect(() => {
    let navigatedOut = false
    if (navigatedOut) return

    if (scriptView === 'code') {
      navigate(`/workspaces/${workspaceId}/scripts/${scriptId}/code`)
    } else {
      navigate(`/workspaces/${workspaceId}/scripts/${scriptId}/triggers`)
    }
    return () => { navigatedOut = true }
  }, [workspaceId, scriptView, scriptId, navigate])
  const handleCloseDial = () => {
    setOpenDial(false)
  }

  const handleOpenDial = () => {
    setOpenDial(true)
  }


  const handleSubmit = (triggerType, trigger) => {
    differentiateTrigger(triggerType, trigger)
    handleCloseDial()
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
            <div className='EditCard-header-text'>
              <ScriptLabel id={script.id} text={script.name} />
              <ScriptLabel id={script.id} text={script.description} type='description' />
            </div>
            <div className='EditCard-header-author'></div>
            <div className='EditCard-header-buttons'>
              <Button
                onClick={() => { if (scriptView !== 'code') setScriptView('code') }}
                color='secondary'
                variant={scriptView === 'code' ? 'contained' : 'outlined'}
                startIcon={<FontAwesomeIcon icon={faCode} />}
              >
                <Typography>Script</Typography>
              </Button>
              <Button
                onClick={() => { if (scriptView !== 'triggers') setScriptView('triggers') }}
                color='secondary'
                variant={scriptView === 'triggers' ? 'contained' : 'outlined'}
                startIcon={<FontAwesomeIcon icon={faLink} />}
              >
                <Typography>Triggers</Typography>
              </Button>
              <Button
                onClick={() => navigate(`/workspaces/${workspaceId}/scripts/all`)}
                color='secondary'
                variant='outlined'
                startIcon={<FontAwesomeIcon icon={faXmark} />}
              >
                <Typography>Exit</Typography>
              </Button>
            </div>
          </div>
          <Outlet />
          {/* <div>
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
                  onClick={deleteScript}
                  className='EditCard-btnDelete'
                  color='error'
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faTrash} />}>
                  <Typography>Delete</Typography>
                </Button>

                {/* <Button
                onClick={handleOpenDial}
                className='EditCard-btnAddTrigger'
                color='secondary'
                fullWidth
                startIcon={<FontAwesomeIcon icon={faPlus} />}>
                <Typography>New Trigger</Typography>
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
          </div> */}
        </div>
        {/* <div className='EditCard-actionBtns'>
          <div className='EditCard-closeWrapper'>
            <IconButton
              onClick={() => navigate(`/workspaces/${workspaceId}/scripts/all`)}
              className='EditCard-btnClose'>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>

          <div>
            <Typography sx={{ fontSize: '24px' }}>Active triggers</Typography>
            {!(isLoading || isError) &&
              <List>
                <ListItem>
                  <Typography sx={{ fontSize: '18px' }}>Callback triggers</Typography>
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
                  <Typography sx={{ fontSize: '18px' }}>Action triggers</Typography>
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
        </div> */}
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
