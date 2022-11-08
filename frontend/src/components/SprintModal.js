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
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { isManager } from '../permissions/ManagerContent'

import './SprintModal.sass'


const SprintModal = () => {
  const [datetime, setDatetime] = React.useState()
  const [taskDescriptionDraft, setTaskDescriptionDraft] = React.useState()
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)
  const [sprintState, setSpringState] = React.useState('1')

  const updateTaskDescriptionDraft = (val) => {
    setTaskDescriptionDraft(val)
    setUnsavedDescriptionDraft(true)
  }

  const taskDescriptionOnClick = () => {
    setDescriptionEditorVisible(true)
    setTimeout(() => {
      document.querySelector('.SprintModal-description-editor textarea').focus()
    }, 50)
  }

  const editTaskDescription = () => {
    const payload = { description: taskDescriptionDraft }
  }

  return (
    <Box className='SprintModal-wrapper'>
      <Card className='SprintModal-paper'>
        <Box className='SprintModal-main'>
          <div className='SprintModal-main-header'>
            <Typography fontSize={24}>Start new sprint</Typography>
          </div>
          <div className='SprintModal-main-name'>
            <Typography fontSize={16}>Sprint name</Typography>
            <Card
              className='SprintModal-main-name-card'>
              <InputBase
                className='SprintModal-main-name-input'
                disabled={isManager() ? undefined : true}
                fullWidth
                multiline
              />
            </Card>
          </div>
          <div className='SprintModal-main-datetime'>
            <Typography fontSize={16}>End date</Typography>
            <LocalizationProvider dateAdapter={AdapterMoment}>
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
                value={taskDescriptionDraft || ''}
                onChange={(val) => { updateTaskDescriptionDraft(val) }}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]]
                }}
              />
              <div className='buttons'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => editTaskDescription()}
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
              </div>
            </div>
          ) : (

            <Card
              className='SprintModal-main-description'
              onClick={isManager() ? taskDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                rehypePlugins={[[rehypeSanitize]]}
              />
            </Card>
          )}
          {!sprintState === '1' ?
            <Button
              color='primary'
              variant='contained'
              fullWidth
            >
            Start Sprint
            </Button> :
            <Button
              color='error'
              variant='contained'
              fullWidth
            >
            End Sprint
            </Button>
          }

        </Box>
      </Card>
    </Box>
  )
}

export default SprintModal

SprintModal.propTypes = {
}
