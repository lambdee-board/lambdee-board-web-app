import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  Button,
  TextField,
  InputBase
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
  const [datetime, setDatetime] = React.useState()
  const editSprintName = React.useRef()
  const [sprintDescriptionDraft, setSprintDescriptionDraft] = React.useState()
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)

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

  const startSprintOnClick = () => {
    const sprint = {
      name: editSprintName,
      description: sprintDescriptionDraft,
      expectedEndAt: datetime.format('DD/MM/YYYY HH:mm:ss'),
      boardId
    }
    apiClient.post('/api/sprints', sprint)
      .then((response) => {
        // successful request
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }

  const endSprintOnClick = () => {

  }

  return (
    <Box className='SprintModal-wrapper'>
      <Card className='SprintModal-paper'>
        <Box className='SprintModal-main'>
          <div className='SprintModal-main-header'>
            {!activeSprint ?
              <Typography fontSize={24}>Start new sprint</Typography>              :
              <Typography fontSize={24}>View sprint</Typography>}

          </div>
          <div className='SprintModal-main-name'>
            <Typography fontSize={16}>Sprint name</Typography>
            <Card
              className='SprintModal-main-name-card'>
              <InputBase
                ref={editSprintName}
                className='SprintModal-main-name-input'
                disabled={isManager() ? undefined : true}
                fullWidth
                multiline
              />
            </Card>
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
            </div>
          ) : (

            <Card
              className='SprintModal-main-description'
              onClick={isManager() ? sprintDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                rehypePlugins={[[rehypeSanitize]]}
              />
            </Card>
          )}
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
