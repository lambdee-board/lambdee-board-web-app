import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  Button,
  TextField,
  InputBase,
  Alert
} from '@mui/material'

import { addAlert } from '../redux/slices/appAlertSlice'
import { useDispatch } from 'react-redux'
import apiClient from '../api/apiClient'
import { useParams } from 'react-router-dom'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { isManager, ManagerContent } from '../permissions/ManagerContent'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'


import './SprintModal.sass'


const SprintModal = ({ activeSprint }) => {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [datetime, setDatetime] = React.useState(activeSprint?.expectedEndAt)
  const editSprintNameRef = React.useRef()
  const [sprintDescriptionDraft, setSprintDescriptionDraft] = React.useState(activeSprint?.description)
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)
  const [toggleEditSprintNameButton, setToggleEditSprintNameButton] = React.useState(false)
  const [sprintFail, setSprintFail] = React.useState(false)

  const editSprintNameOnClick = () => {
    setToggleEditSprintNameButton(true)
    setTimeout(() => {
      document.querySelector('.SprintModal-main-name-input textarea').focus()
    }, 50)
  }

  const editSprintName = () => {
    const updatedSprint = { name: editSprintNameRef.current.value }
    if (!updatedSprint.name) {
      setToggleEditSprintNameButton(false)
    }

    apiClient.put(`/api/sprints/${activeSprint.id}`, updatedSprint)
      .then((response) => {
        // successful request
        setToggleEditSprintNameButton(false)
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const updateSprintDescriptionDraft = (val) => {
    setSprintDescriptionDraft(val)
    setUnsavedDescriptionDraft(true)
  }

  const sprintDescriptionOnClick = () => {
    setDescriptionEditorVisible(true)
    setTimeout(() => {
      document.querySelector('.SprintModal-description-editor textarea').focus()
    }, 50)
  }
  const editSprintDescription = () => {
    const payload = { description: sprintDescriptionDraft }

    apiClient.put(`/api/sprints/${activeSprint.id}`, payload)
      .then((response) => {
        // successful request
        setDescriptionEditorVisible(false)
        setUnsavedDescriptionDraft(false)
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const startSprintOnClick = () => {
    // for some reason, error 422 unprocessable entity isn't being caught be axios, had to circumvent that by this piece of code
    if (!(editSprintNameRef.current.value && sprintDescriptionDraft && datetime?.format('DD/MM/YYYY HH:mm:ss'))) {
      setSprintFail(true)
    }
    const sprint = {
      boardId,
      name: editSprintNameRef.current.value,
      description: sprintDescriptionDraft,
      expectedEndAt: datetime?.format('DD/MM/YYYY HH:mm:ss')
    }
    apiClient.post('/api/sprints', sprint)
      .then((response) => {
        // successful request
      })
      .catch((error) => {
        // failed or rejected
        // setSprintFail(true)
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const endSprintOnClick = () => {
    apiClient.put(`/api/sprints/${activeSprint.id}/end`)
      .then((response) => {
        // successful request
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  return (
    <Box className='SprintModal-wrapper'>
      <Card className='SprintModal-paper'>
        <Box className='SprintModal-main'>
          <div className='SprintModal-main-header'>
            {!activeSprint ?
              <Typography fontSize={24}>Start new sprint</Typography>              :
              <Typography fontSize={24}>View active sprint</Typography>}

          </div>
          <div className='SprintModal-main-name'>
            <Typography fontSize={16}>Sprint name</Typography>
            <Card
              className='SprintModal-main-name-card'>
              {!toggleEditSprintNameButton ?
                <Typography sx={{ width: '100%' }} onClick={isManager() ? (e) => editSprintNameOnClick() : undefined}>{activeSprint?.name}</Typography>                :
                <InputBase
                  inputRef={editSprintNameRef}
                  defaultValue={activeSprint?.name}
                  className='SprintModal-main-name-input'
                  disabled={isManager() ? undefined : true}
                  fullWidth
                  multiline
                />
              }
            </Card>
            {activeSprint && toggleEditSprintNameButton &&
                <div className='buttons'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => editSprintName()}
                  >
                  Save
                  </Button>
                  <Button
                    variant='text'
                    sx={{ color: '#FF0000' }}
                    onClick={(e) => setToggleEditSprintNameButton(false)}
                  >
                  Cancel
                  </Button>
                </div>}
          </div>
          <div className='SprintModal-main-datetime'>
            <Typography fontSize={16}>End date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                disabled={isManager() ? undefined : true}
                value={datetime}
                onChange={(newValue) => {
                  setDatetime(newValue)
                }}
              />
            </LocalizationProvider>
          </div>
          <Typography fontSize={16}>Sprint description</Typography>
          {unsavedDescriptionDraft ? (
            <Typography className='SprintModal-description-label-unsaved-changes' variant='caption'>
                Unsaved Changes
            </Typography>
          ) : null}
          {descriptionEditorVisible ? (
            <div className='SprintModal-description-editor'>
              <MDEditor
                value={sprintDescriptionDraft || ''}
                onChange={(val) => { updateSprintDescriptionDraft(val) }}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]]
                }}
              />
              {activeSprint &&
                <div className='buttons'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => editSprintDescription()}
                  >
                  Save
                  </Button>
                  <Button
                    variant='text'
                    sx={{ color: '#FF0000' }}
                    onClick={() => setDescriptionEditorVisible(false)}
                  >
                  Cancel
                  </Button>
                </div>}
            </div>
          ) : (

            <Card
              className='SprintModal-main-description'
              onClick={isManager() ? sprintDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                source={sprintDescriptionDraft || '###### Add a description...'}
                rehypePlugins={[[rehypeSanitize]]}
              />
            </Card>
          )}
          {sprintFail &&
          <Alert severity='error' sx={{ width: '94%', mb: '16px' }}>All values have to be set!</Alert>
          }
          {!activeSprint ?
            <Button
              color='primary'
              variant='contained'
              onClick={startSprintOnClick}
              fullWidth
            >
            Start Sprint
            </Button> :
            <ManagerContent>
              <Button
                color='error'
                variant='contained'
                onClick={endSprintOnClick}
                fullWidth
              >
            End Sprint
              </Button>
            </ManagerContent>
          }

        </Box>
      </Card>
    </Box>
  )
}

export default SprintModal

SprintModal.propTypes = {
  activeSprint: PropTypes.any
}
