import * as React from 'react'
import { Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'

import ColorPickerPopover from '../ColorPickerPopover'
import apiClient from '../../api/api-client'

const UiTriggerFrom = (props) => {
  const [workspaces, setWorkspaces] = React.useState([])
  const [boards, setBoards] = React.useState([])
  const [lists, setLists] = React.useState([])
  const [tasks, setTasks] = React.useState([])

  const [subjectIdData, setSubjectIdData] = React.useState([])
  const [scopeIdData, setScopeIdData] = React.useState([])

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

    if (uiTriggerState.subjectType === 'Global') return

    const scopeArr = [
      'DB::Workspace',
      'DB::Board',
      'DB::List',
      'DB::Task',
    ]
    setTriggerScopeTypes(scopeArr.slice(0, scopeArr.indexOf(uiTriggerState.subjectType)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTriggerState.subjectType])

  React.useEffect(() => {
    if (uiTriggerState.subjectId === '') return
    setUiTriggerState({
      ...uiTriggerState,
      scopeType: '',
      scopeId: ''
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTriggerState.subjectId])

  const requestData = (objectName) => {
    apiClient.get(`/api/${objectName}`)
      .then((response) => {
      // successful request
        console.log(response.data[objectName])
        return response.data[objectName]
      })
      .catch((error) => {
        return []
      })
  }

  const prepareSelectIdData = (assignFunc, type) => {
    switch (type) {
    case 'DB::Workspace':
      if (workspaces.length === 0) setWorkspaces(requestData('workspaces'))
      else assignFunc(workspaces)
      break
    case 'DB::Board':
      if (boards.length === 0) setBoards(requestData('boards'))
      else assignFunc(boards)
      break
    case 'DB::Lists':
      if (lists.length === 0) setLists(requestData('lists'))
      else assignFunc(lists)
      break
    case 'DB::Task':
      if (tasks.length === 0) setTasks(requestData('tasks'))
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

  return (
    <div>
      <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
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


          {/* <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={uiTriggerState.subjectId}
            onChange={(event) => setUiTriggerState({
              ...uiTriggerState,
              subjectId: event.target.value,
            })}
            label='Subject ID'
            variant='standard'
            disabled={subjectTypeGlobal()}/> */}
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            disabled={subjectTypeGlobal() || !subjectIdNil()}
            id='Trigger-scope-type'
            value={uiTriggerState.scopeType}
            label='Scope Type'
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              scopeType: e.target.value
            })}>
            { triggerScopeTypes.map((action, idx) => (
              <MenuItem value={action} key={`${action}-${idx}`}>
                {action}
              </MenuItem>
            ))}
          </TextField>

          {/* TODO - LIST WITH FETCHING AVAILABLE  */}
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={uiTriggerState.scopeId}
            onChange={(e) => setUiTriggerState({
              ...uiTriggerState,
              scopeId: e.target.value,
            })}
            label='Scope ID'
            variant='standard'
            disabled={subjectTypeGlobal() || !subjectIdNil()} />
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
        <Button size='large' onClick={() => props.handleSubmit('ui', uiTriggerState)}>Create</Button>
      </div>
    </div>
  )
}


UiTriggerFrom.propTypes = {
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default UiTriggerFrom
