import * as React from 'react'
import { Alert, Box, Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'

import ColorPickerPopover from '../ColorPickerPopover'
import apiClient from '../../api/axios-client'

interface Props {
  handleCloseDial: () => void
  handleSubmit: (type: string, state: unknown) => void
}

const UiTriggerFrom = ({ handleCloseDial, handleSubmit }: Props) => {
  const [workspaces, setWorkspaces] = React.useState<unknown[]>([])
  const [boards, setBoards] = React.useState<unknown[]>([])
  const [lists, setLists] = React.useState<unknown[]>([])
  const [tasks, setTasks] = React.useState<unknown[]>([])
  const assignBoardData: Record<string, React.Dispatch<React.SetStateAction<unknown[]>>> = {
    workspaces: setWorkspaces,
    boards: setBoards,
    lists: setLists,
    tasks: setTasks
  }

  const [subjectIdData, setSubjectIdData] = React.useState<unknown[]>([])
  const [scopeIdData, setScopeIdData] = React.useState<unknown[]>([])

  const [showErrorMessage, setShowErrorMessage] = React.useState(false)

  const [triggerScopeTypes, setTriggerScopeTypes] = React.useState<string[]>([])
  const [uiTriggerState, setUiTriggerState] = React.useState({
    subjectType: 'Global',
    subjectId: '',
    scopeType: '',
    scopeId: '',
    private: true,
    color: '#1082F3',
    text: '',
    delay: 0
  })
  const triggerSubjectTypes = [
    'Global',
    'DB::Workspace',
    'DB::Board',
    'DB::Task',
  ]

  React.useEffect(() => {
    setUiTriggerState({
      ...uiTriggerState,
      scopeType: '',
      scopeId: '',
      subjectId: ''
    })
    setShowErrorMessage(false)

    if (uiTriggerState.subjectType === 'Global') return

    const scopeArr = [
      'DB::Workspace',
      'DB::Board',
      'DB::List',
      'DB::Task',
    ]
    const slicedScopeArr = scopeArr.slice(0, scopeArr.indexOf(uiTriggerState.subjectType))
    setTriggerScopeTypes(slicedScopeArr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTriggerState.subjectType])

  React.useEffect(() => {
    if (uiTriggerState.subjectId === '') return
    setShowErrorMessage(false)
    setUiTriggerState({
      ...uiTriggerState,
      scopeType: '',
      scopeId: ''
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTriggerState.subjectId])

  React.useEffect(() => {
    if (uiTriggerState.scopeType === '') return
    setShowErrorMessage(false)
    setUiTriggerState({
      ...uiTriggerState,
      subjectId: ''
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTriggerState.scopeType])

  const requestData = async (assignFunc: React.Dispatch<React.SetStateAction<unknown[]>>, objectName: string) => {
    await apiClient.get(`/api/${objectName}`)
      .then((response) => {
        assignFunc(response.data[objectName] ? response.data[objectName] : response.data)
        assignBoardData[objectName](response.data[objectName] ? response.data[objectName] : response.data)
      })
      .catch((error) => {
        console.log('errrrrrrrrr')
      })
  }

  const prepareSelectIdData = (assignFunc: React.Dispatch<React.SetStateAction<unknown[]>>, type: string) => {
    switch (type) {
    case 'DB::Workspace':
      if (workspaces.length === 0) requestData(assignFunc, 'workspaces')
      else assignFunc(workspaces)
      break
    case 'DB::Board':
      if (boards.length === 0) requestData(assignFunc, 'boards')
      else assignFunc(boards)
      break
    case 'DB::List':
      if (lists.length === 0) requestData(assignFunc, 'lists')
      else assignFunc(lists)
      break
    case 'DB::Task':
      if (tasks.length === 0) requestData(assignFunc, 'tasks')
      else assignFunc(tasks)
      break
    default:
      break
    }
  }

  const subjectTypeGlobal = () => {
    return uiTriggerState.subjectType === 'Global'
  }

  const subjectIdNil = () => {
    return uiTriggerState.subjectId === ''
  }

  const validateBeforeRequest = () => {
    if (uiTriggerState.subjectType !== 'Global' && uiTriggerState.subjectId === '') {
      if (uiTriggerState.scopeType === '' || uiTriggerState.scopeId === '') {
        setShowErrorMessage(true)
        return
      }
    }
    handleSubmit('ui', uiTriggerState)
    setShowErrorMessage(false)
  }

  return (
    <div>
      <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', gap: 1, mt: 2 }}>
        { showErrorMessage &&
          <Alert severity='error'>When <strong>Subject Type</strong> is not set to <strong>Global</strong> you need to: <br />
          - Select <strong>Subject Id</strong><br />
          OR<br />
          - Select both <strong>Scope Type</strong> and <strong>Scope Id</strong><br />
          </Alert>
        }
        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-subject-type'
            value={uiTriggerState.subjectType}
            label='Subject Type'
            onChange={(e) => {
              setUiTriggerState({
                ...uiTriggerState,
                subjectType: e.target.value
              })
              prepareSelectIdData(setSubjectIdData, e.target.value)
            }}>
            { triggerSubjectTypes.map((action, idx) => (
              <MenuItem value={action} key={`${action}-${idx}`}>
                {action}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-subject-id'
            value={uiTriggerState.subjectId}
            label='Subject ID'
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              subjectId: e.target.value,
            })
            }
            disabled={subjectTypeGlobal()}>
            { (subjectIdData as Array<{ id: number; name: string }>)?.map((item, idx) => (
              <MenuItem value={item.id} key={`${item.name}-${idx}`}>
                {item.id} - {item.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            disabled={subjectTypeGlobal()}
            id='Trigger-scope-type'
            value={uiTriggerState.scopeType}
            label='Scope Type'
            onChange={(e) => {
              setUiTriggerState({
                ...uiTriggerState,
                scopeType: e.target.value
              })
              prepareSelectIdData(setScopeIdData, e.target.value)
            }}>
            { triggerScopeTypes.map((action, idx) => (
              <MenuItem value={action} key={`${action}-${idx}`}>
                {action}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-scope-id'
            value={uiTriggerState.scopeId}
            label='Scope ID'
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              scopeId: e.target.value,
            })}
            disabled={subjectTypeGlobal() || !subjectIdNil()} >
            { (scopeIdData as Array<{ id: number; name: string }>)?.map((item, idx) => (
              <MenuItem value={item.id} key={`${item.name}-${idx}`}>
                {item.id} - {item.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='text'
            value={uiTriggerState.text}
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              text: e.target.value,
            })}
            label='Button Text'
            variant='standard'
          />

          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={uiTriggerState.delay}
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              delay: Number(e.target.value),
            })}
            label='Delay (seconds)'
            variant='standard'
          />
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', height: '68px' }}>
            <Typography>Button Color</Typography>
            <ColorPickerPopover
              color={uiTriggerState.color}
              onChange={(color) => {
                setUiTriggerState({
                  ...uiTriggerState,
                  color
                })
              }} />
          </div>

          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'flex-start', m: 0, width: '150px', height: '68px' }}
            value='start'
            control={
              <Switch color='primary' onChange={(e) => setUiTriggerState({
                ...uiTriggerState,
                private: e.target.checked,
              })} defaultChecked />}
            label='Private'
            labelPlacement='start'
            disabled={subjectTypeGlobal()} />
        </div>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button size='large' onClick={handleCloseDial}>Cancel</Button>
        <Button size='large' onClick={validateBeforeRequest}>Create</Button>
      </Box>
    </div>
  )
}

export default UiTriggerFrom
