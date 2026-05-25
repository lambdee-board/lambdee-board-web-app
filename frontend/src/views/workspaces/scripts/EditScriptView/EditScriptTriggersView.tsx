import * as React from 'react'


import { Button, Divider, ListItem, ListItemText, Typography, Card, Box, Modal } from '@mui/material'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useAppAlertStore from '../../../../stores/app-alert'
import apiClient from '../../../../api/axios-client'
import useScript from '../../../../api/script'

import ScriptTriggerDialog from '../../../../components/ScriptTriggerDialog'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import { useParams } from 'react-router-dom'
import CustomAlert from '../../../../components/custom-alert/CustomAlert'


export default function EditScriptTriggersView() {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [openDial, setOpenDial] = React.useState(false)
  const { scriptId } = useParams()
  const { data: script, isLoading, isError, mutate } = useScript({ id: scriptId })
  const [alertModalState, setAlertModalState] = React.useState(false)

  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const handleCloseDial = () => {
    setOpenDial(false)
  }

  const handleOpenDial = () => {
    setOpenDial(true)
  }


  const handleSubmit = (triggerType: string, trigger: unknown) => {
    differentiateTrigger(triggerType, trigger)
    handleCloseDial()
  }
  const saveTrigger = (type: string, trigger: Record<string, unknown>, path: string) => {
    const clearedTrigger = Object.fromEntries(Object.entries(trigger).filter(([_, v]) => v !== ''))

    const payload = {
      authorId: parseInt(localStorage.getItem('id')!),
      scriptId: script.id,
      ...clearedTrigger
    }
    console.log(path, payload)
    apiClient.post(path, payload)
      .then((response) => {
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
        addAlert({ severity: 'success', message: 'Trigger created!' })
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }


  const differentiateTrigger = (triggerType: string, trigger: unknown) => {
    const t = trigger as Record<string, unknown>
    switch (triggerType) {
    case 'callback':
      saveTrigger(triggerType, t, '/api/script_triggers')
      break
    case 'ui':
      if (t.subjectType === 'Global') {
        t.subjectType = ''
      }
      saveTrigger(triggerType, t, '/api/ui_script_triggers')
      break
    case 'schedule':
      saveTrigger(triggerType, t, '/api/schedule_script_triggers')
    }
  }
  const deleteTrigger = (triggerType: string, triggerId: number) => {
    apiClient.delete(`/api/${triggerType}/${triggerId}`)
      .then((response) => {
        switch (triggerType) {
        case 'script_triggers':
          toggleAlertModalState()
          mutate({ ...script, scriptTriggers: [...script.scriptTriggers.filter((trigger) => trigger.id !== triggerId)] }, { revalidate: false })
          break
        case 'ui_script_triggers':
          toggleAlertModalState()
          mutate({ ...script, uiScriptTriggers: [...script.uiScriptTriggers.filter((trigger) => trigger.id !== triggerId)] }, { revalidate: false })
          break
        case 'schedule_script_triggers':
          break
        }
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }
  if (isLoading || isError) return (<></>)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 1.5, mt: 3 }}>
        <Button
          onClick={handleOpenDial}
          variant='outlined'
          color='secondary'
          startIcon={<FontAwesomeIcon icon={faPlus} />}>
          <Typography>Create new Trigger</Typography>
        </Button>
      </Box>
      {script?.scriptTriggers.length === 0 && script?.uiScriptTriggers.length === 0 && <Typography sx={{ width: '100%',
        fontSize: '32px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#029fd1',
        opacity: '0.3' }}>no triggers created</Typography>}
      {script?.scriptTriggers.length !== 0 && <Divider>Callback Triggers</Divider>}
      <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
        {script?.scriptTriggers?.map((trigger, idx) => (
          <div key={`trigger-${idx}`}>
            <Card sx={{ display: 'flex', width: '240px', flexDirection: 'column', alignItems: 'center', p: 1.5, m: 1.5 }}>
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
                  <CustomAlert confirmAction={() => deleteTrigger('script_triggers', trigger.id)}
                    dismissAction={() => {
                      toggleAlertModalState()
                    }}
                    title='Delete Trigger?'
                    message={'Are you sure you want to delete this trigger?'}
                    confirmMessage='Confirm, delete trigger' />
                </Box>
              </Modal>
              <ListItem
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <ListItemText primary={`Action: ${trigger.action}`} />
                <ListItemText
                  primary={`Private: ${trigger.private}`}
                  secondary={`Delay: ${trigger.delay || 0}`} />
                <ListItemText
                  primary={`Subject type: ${trigger.subjectType || 'all'}`}
                  secondary={`Subject Id: ${trigger.subjectId}`} />
                <ListItemText
                  primary={`Scope type: ${trigger.scopeType || 'all'}`}
                  secondary={`Scope Id: ${trigger.scopeId}`} />
              </ListItem>
              <Button
                variant='contained'
                color='error'
                onClick={toggleAlertModalState}>
                Delete
              </Button>
            </Card>
          </div>
        ))}
      </Box>
      {script?.uiScriptTriggers.length !== 0 && <Divider sx={{ mt: 1.5 }}>Action Triggers</Divider>}
      <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
        {script?.uiScriptTriggers?.map((uiTrigger, idx) => (
          <Box sx={{ display: 'flex', flexDirection: 'row' }} key={`ui-trigger-${idx}`}>
            <Card sx={{ width: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1.5, m: 1.5 }}>
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
                  <CustomAlert confirmAction={() => deleteTrigger('ui_script_triggers', uiTrigger.id)}
                    dismissAction={() => {
                      toggleAlertModalState()
                    }}
                    title='Delete Trigger?'
                    message={'Are you sure you want to delete this trigger?'}
                    confirmMessage='Confirm, delete trigger' />
                </Box>
              </Modal>
              <ListItem
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
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
                  secondary={`Color: ${uiTrigger.color}`} />
              </ListItem>
              <Button
                variant='contained'
                color='error'
                sx={{ display: 'flex' }}
                onClick={toggleAlertModalState}>
                Delete
              </Button>
            </Card>
          </Box>
        ))}
      </Box>
      <ScriptTriggerDialog
        openDial={openDial}
        handleCloseDial={handleCloseDial}
        handleSubmit={handleSubmit}
      />
    </Box>
  )
}
