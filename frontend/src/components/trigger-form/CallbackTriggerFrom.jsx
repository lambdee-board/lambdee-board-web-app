import * as React from 'react'
import { Alert, Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'
import PropTypes from 'prop-types'

import apiClient from '../../api/api-client'

const CallbackTriggerFrom = (props) => {
  const triggerActions = ['create', 'destroy', 'update']
  const [triggerScopeTypes, setTriggerScopeTypes] = React.useState([])

  const triggerSubjectTypes = [
    'DB::Workspace',
    'DB::Board',
    'DB::List',
    'DB::Task',
    'DB::Comment',
    'DB::Sprint',
    'DB::Tag',
    'DB::User'
  ]

  const [callbackTriggerState, setCallbackTriggerState] = React.useState({
    action: '',
    subjectType: '',
    subjectId: '',
    scopeType: '',
    scopeId: '',
    private: true,
    delay: 0,
  })


  const [workspaces, setWorkspaces] = React.useState([])
  const [boards, setBoards] = React.useState([])
  const [lists, setLists] = React.useState([])
  const [tasks, setTasks] = React.useState([])
  const [comments, setComments] = React.useState([])
  const [sprints, setSprints] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [users, setUsers] = React.useState([])
  const assignBoardData = {
    workspaces: setWorkspaces,
    boards: setBoards,
    lists: setLists,
    tasks: setTasks,
    comments: setComments,
    sprints: setSprints,
    tags: setTags,
    users: setUsers
  }

  const [subjectIdData, setSubjectIdData] = React.useState([])
  const [scopeIdData, setScopeIdData] = React.useState([])

  const [showErrorMessage, setShowErrorMessage] = React.useState(false)


  React.useEffect(() => {
    setCallbackTriggerState({
      ...callbackTriggerState,
      scopeType: '',
      scopeId: '',
      subjectId: ''
    })
    setShowErrorMessage(false)

    if (callbackTriggerState.subjectType === 'DB::User') return setTriggerScopeTypes([])

    if (['DB::Sprint', 'DB::Tag'].includes(callbackTriggerState.subjectType)) return setTriggerScopeTypes(['DB::Workspaces', 'DB::Board'])

    const slicedScopeArr = triggerSubjectTypes.slice(0, triggerSubjectTypes.indexOf(callbackTriggerState.subjectType))
    setTriggerScopeTypes(slicedScopeArr)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackTriggerState.subjectType])

  React.useEffect(() => {
    if (callbackTriggerState.subjectId === '') return
    setShowErrorMessage(false)
    setCallbackTriggerState({
      ...callbackTriggerState,
      scopeType: '',
      scopeId: ''
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackTriggerState.subjectId])

  React.useEffect(() => {
    if (callbackTriggerState.scopeType === '') return
    setShowErrorMessage(false)
    setCallbackTriggerState({
      ...callbackTriggerState,
      subjectId: ''
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackTriggerState.scopeType])

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
    case 'DB::Comment':
      if (comments.length === 0) requestData(assignFunc, 'comments')
      else assignFunc(comments)
      break
    case 'DB::Sprint':
      if (sprints.length === 0) requestData(assignFunc, 'sprints')
      else assignFunc(sprints)
      break
    case 'DB::Tag':
      if (tags.length === 0) requestData(assignFunc, 'tags')
      else assignFunc(tags)
      break
    case 'DB::User':
      if (users.length === 0) requestData(assignFunc, 'users')
      else assignFunc(users)
      break
    default:
      break
    }
  }

  const subjectTypeGlobal = () => {
    return callbackTriggerState.subjectType === 'Global'
  }

  const subjectIdNil = () => {
    return callbackTriggerState.subjectId === ''
  }

  const validateBeforeRequest = () => {
    if (callbackTriggerState.subjectType !== 'Global' && callbackTriggerState.subjectId === '') {
      if (callbackTriggerState.scopeType === '' || callbackTriggerState.scopeId === '') {
        setShowErrorMessage(true)
        return
      }
    }
    props.handleSubmit('ui', callbackTriggerState)
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
            fullWidth
            margin='dense'
            select
            id='Trigger-action'
            value={callbackTriggerState.action}
            label='Action'
            onChange={(e) => {
              setCallbackTriggerState({
                ...callbackTriggerState,
                action: e.target.value
              })
            }}>
            { triggerActions.map((action, idx) => (
              <MenuItem value={action} key={`${action}-${idx}`}>
                {action}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            select
            id='Trigger-subject-type'
            value={callbackTriggerState.subjectType}
            label='Subject Type'
            onChange={(e) => {
              setCallbackTriggerState({
                ...callbackTriggerState,
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
            value={callbackTriggerState.subjectId}
            label='Subject ID'
            onChange={(e) => setCallbackTriggerState({
              ...callbackTriggerState,
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
            value={callbackTriggerState.scopeType}
            label='Scope Type'
            onChange={(e) => {
              setCallbackTriggerState({
                ...callbackTriggerState,
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
            value={callbackTriggerState.scopeId}
            label='Scope ID'
            onChange={(e) => setCallbackTriggerState({
              ...callbackTriggerState,
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

        <div style={{ display: 'flex', flexFlow: 'row' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={callbackTriggerState.delay}
            onChange={(e) => setCallbackTriggerState({
              ...callbackTriggerState,
              delay: e.target.value,
            })}
            label='Delay (seconds)'
            variant='standard'
          />

          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'flex-start', m: 0, width: '150px', height: '60px', ml: '68px' }}
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


CallbackTriggerFrom.propTypes = {
  handleCloseDial: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default CallbackTriggerFrom
