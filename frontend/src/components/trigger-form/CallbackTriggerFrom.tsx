import * as React from 'react'
import { Alert, Box, Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'

import apiClient from '../../api/axios-client'

interface Props {
  handleCloseDial: () => void
  handleSubmit: (type: string, state: unknown) => void
}

const CallbackTriggerFrom = ({ handleCloseDial, handleSubmit }: Props) => {
  const triggerActions = ['create', 'destroy', 'update']
  const [triggerScopeTypes, setTriggerScopeTypes] = React.useState<string[]>([])

  const triggerSubjectTypes = [
    'DB::Workspace',
    'DB::Board',
    'DB::List',
    'DB::Task',
    'DB::Comment',
    'DB::Sprint',
    'DB::Tag',
    'DB::User',
    'DB::TaskUser'
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


  const [workspaces, setWorkspaces] = React.useState<unknown[]>([])
  const [boards, setBoards] = React.useState<unknown[]>([])
  const [lists, setLists] = React.useState<unknown[]>([])
  const [tasks, setTasks] = React.useState<unknown[]>([])
  const [comments, setComments] = React.useState<unknown[]>([])
  const [sprints, setSprints] = React.useState<unknown[]>([])
  const [tags, setTags] = React.useState<unknown[]>([])
  const [users, setUsers] = React.useState<unknown[]>([])
  const assignBoardData: Record<string, React.Dispatch<React.SetStateAction<unknown[]>>> = {
    workspaces: setWorkspaces,
    boards: setBoards,
    lists: setLists,
    tasks: setTasks,
    comments: setComments,
    sprints: setSprints,
    tags: setTags,
    users: setUsers
  }

  const [subjectIdData, setSubjectIdData] = React.useState<unknown[]>([])
  const [scopeIdData, setScopeIdData] = React.useState<unknown[]>([])

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

    if (callbackTriggerState.subjectType === 'DB::TaskUser') return setTriggerScopeTypes(['DB::Workspace', 'DB::Board', 'DB::List', 'DB::Task'])

    if (['DB::Sprint', 'DB::Tag'].includes(callbackTriggerState.subjectType)) return setTriggerScopeTypes(['DB::Workspace', 'DB::Board'])

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
    handleSubmit('callback', callbackTriggerState)
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
        <Box sx={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
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
        </Box>

        <Box sx={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
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
            { (subjectIdData as Array<{ id: number; name: string }>)?.map((item, idx) => (
              <MenuItem value={item.id} key={`${item.name}-${idx}`}>
                {item.id} - {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', flexFlow: 'row', justifyContent: 'space-between' }}>
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
            { (scopeIdData as Array<{ id: number; name: string }>)?.map((item, idx) => (
              <MenuItem value={item.id} key={`${item.name}-${idx}`}>
                {item.id} - {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', flexFlow: 'row' }}>
          <TextField
            sx={{ width: '200px' }}
            margin='dense'
            type='number'
            value={callbackTriggerState.delay}
            onChange={(e) => setCallbackTriggerState({
              ...callbackTriggerState,
              delay: Number(e.target.value),
            })}
            label='Delay (seconds)'
            variant='standard'
          />

          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'flex-start', m: 0, width: '150px', height: '60px', ml: 8.5 }}
            value='start'
            control={
              <Switch color='primary' onChange={(e) => setCallbackTriggerState({
                ...callbackTriggerState,
                private: e.target.checked,
              })} defaultChecked />}
            label='Private'
            labelPlacement='start'
            disabled={subjectTypeGlobal()} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button size='large' onClick={handleCloseDial}>Cancel</Button>
        <Button size='large' onClick={validateBeforeRequest}>Create</Button>
      </Box>
    </div>
  )
}

export default CallbackTriggerFrom
