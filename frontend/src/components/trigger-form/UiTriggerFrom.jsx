import * as React from 'react'
import { Alert, Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import ColorPickerPopover from '../ColorPickerPopover'
import apiClient from '../../api/api-client'

const UiTriggerFrom = (props) => {
  const [workspaces, setWorkspaces] = React.useState([])
  const [boards, setBoards] = React.useState([])
  const [lists, setLists] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const assignBoardData = {
    workspaces: setWorkspaces,
    boards: setBoards,
    lists: setLists,
    tasks: setTasks
  }

  const [subjectIdData, setSubjectIdData] = React.useState([])
  const [scopeIdData, setScopeIdData] = React.useState([])

  const [showErrorMessage, setShowErrorMessage] = React.useState(false)

  const [triggerScopeTypes, setTriggerScopeTypes] = React.useState([])
  const [uiTriggerState, setUiTriggerState] = React.useState({
    subjectType: 'Global',
    subjectId: '',
    scopeType: '',
    scopeId: '',
    private: true,
    colour: '#1082F3',
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

  const requestData = async(assignFunc, objectName) => {
    await apiClient.get(`/api/${objectName}`)
      .then((response) => {
      // successful request
        assignFunc(response.data[objectName] ? response.data[objectName] : response.data)
        assignBoardData[objectName](response.data[objectName] ? response.data[objectName] : response.data)
      })
      .catch((error) => {
        console.log('errrrrrrrrr')
      })
  }

  const prepareSelectIdData = (assignFunc, type) => {
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
    props.handleSubmit('ui', uiTriggerState)
    setShowErrorMessage(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
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
            { subjectIdData?.map((item, idx) => (
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
            { scopeIdData?.map((item, idx) => (
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
              delay: e.target.value,
            })}
            label='Delay (seconds)'
            variant='standard'
          />
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', height: '60px' }}>
            <Typography>Button Color</Typography>
            <ColorPickerPopover
              color={uiTriggerState.colour}
              onChange={(colour) => {
                setUiTriggerState({
                  ...uiTriggerState,
                  colour
                })
              }} />
          </div>

          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'flex-start', m: 0, width: '150px', height: '60px' }}
            value='start'
            control={<Switch color='primary' defaultChecked />}
            label='Private'
            labelPlacement='start'
            disabled={subjectTypeGlobal()} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button size='large' onClick={props.handleCloseDial}>Cancel</Button>
        <Button size='large' onClick={validateBeforeRequest}>Create</Button>
      </div>
    </div>
  )
}


UiTriggerFrom.propTypes = {
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default UiTriggerFrom
