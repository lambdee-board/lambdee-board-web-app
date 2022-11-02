import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  Card,
  Skeleton,
  Avatar,
  Stack,
  IconButton,
  Button,
  ClickAwayListener,
  FilledInput,
  TextField,
  InputBase
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'

import './SprintModal.sass'


const SprintModal = () => {
  const [datetime, setDatetime] = React.useState()
  const [taskDescriptionDraft, setTaskDescriptionDraft] = React.useState()
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)

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
                  onClick={() => editTaskDescription()}
                >
                  Save
                </Button>
                <Button
                  variant='text'
                  color='secondary'
                  onClick={() => setDescriptionEditorVisible(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (

            <Card
              className='SprintModal-main-description'
              onClick={taskDescriptionOnClick}
            >
              <MDEditor.Markdown
                rehypePlugins={[[rehypeSanitize]]}
              />
            </Card>


          )}
        </Box>
      </Card>
    </Box>
  )
}

export default SprintModal

SprintModal.propTypes = {
  closeModal: PropTypes.func.isRequired
}
