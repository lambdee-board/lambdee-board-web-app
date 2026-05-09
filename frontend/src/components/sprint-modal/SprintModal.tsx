import * as React from 'react'
import { useParams } from 'react-router-dom'
import rehypeSanitize from 'rehype-sanitize'

import {
  Typography,
  Box,
  Card,
  Button,
  TextField,
  InputBase,
  Alert,
  Modal
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MDEditor from '@uiw/react-md-editor'

import useAppAlertStore from '../../stores/app-alert'
import apiClient from '../../api/axios-client'
import useBoard from '../../api/board'
import { mutateList } from '../../api/list'
import { isManager } from '../../internal/permissions'
import type { Sprint } from '../../types'

import { ManagerContent } from '../../permissions/content'
import ReportModal from '../reports-view/report-modal/ReportModal'
import CustomAlert from '../custom-alert/CustomAlert'

import './SprintModal.sass'

interface Props {
  activeSprint?: Sprint
  closeModal?: () => void
  mutate?: (args: { id: string | number }) => void
}

const SprintModal = ({ activeSprint, closeModal, mutate }: Props) => {
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const { boardId } = useParams()
  const editSprintNameRef = React.useRef<HTMLInputElement>(null)
  const { data: board } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'non-archived' } } })
  const [openReportModal, setOpenReportModal] = React.useState(false)
  const [datetime, setDatetime] = React.useState<unknown>(activeSprint?.expectedEndAt)
  const [sprintDescriptionDraft, setSprintDescriptionDraft] = React.useState<string | undefined>(activeSprint?.description)
  const [unsavedDescriptionDraft, setUnsavedDescriptionDraft] = React.useState(false)
  const [descriptionEditorVisible, setDescriptionEditorVisible] = React.useState(false)
  const [editSprintNameButton, setEditSprintNameButton] = React.useState(false)
  const [editDatetimeButton, setEditDatetimeButton] = React.useState(false)
  const [sprintFail, setSprintFail] = React.useState(false)
  const [alertModalState, setAlertModalState] = React.useState(false)
  const toggleAlertModalState = () => {
    setAlertModalState(!alertModalState)
  }

  const formatDatetime = (dt: unknown) => {
    const d = dt as { format: (fmt: string) => string }
    return d.format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  }

  const editDatetime = () => {
    const updatedDatetime = { expectedEndAt: formatDatetime(datetime) }

    apiClient.put(`/api/sprints/${activeSprint!.id}`, updatedDatetime)
      .then((response) => {
        mutate?.({ id: activeSprint!.boardId })
        setEditDatetimeButton(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const cancelEditDatetime = () => {
    setEditDatetimeButton(false)
    setDatetime(activeSprint!.expectedEndAt)
  }

  const editSprintNameOnClick = () => {
    setEditSprintNameButton(true)
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('.SprintModal-main-name-input textarea')?.focus()
    }, 50)
  }

  const editSprintName = () => {
    const updatedSprint = { name: editSprintNameRef.current?.value }
    if (!updatedSprint.name) {
      setEditSprintNameButton(false)
    }

    apiClient.put(`/api/sprints/${activeSprint!.id}`, updatedSprint)
      .then((response) => {
        mutate?.({ id: activeSprint!.boardId })
        setEditSprintNameButton(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const updateSprintDescriptionDraft = (val: string | undefined) => {
    setSprintDescriptionDraft(val)
    setUnsavedDescriptionDraft(true)
  }

  const sprintDescriptionOnClick = () => {
    setDescriptionEditorVisible(true)
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>('.SprintModal-description-editor textarea')?.focus()
    }, 50)
  }
  const editSprintDescription = () => {
    const payload = { description: sprintDescriptionDraft }

    apiClient.put(`/api/sprints/${activeSprint!.id}`, payload)
      .then((response) => {
        mutate?.({ id: activeSprint!.boardId })
        setDescriptionEditorVisible(false)
        setUnsavedDescriptionDraft(false)
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const startSprintOnClick = () => {
    if (!(editSprintNameRef?.current?.value && sprintDescriptionDraft && datetime && formatDatetime(datetime))) {
      setSprintFail(true)
    } else {
      const sprint = {
        boardId,
        name: editSprintNameRef.current!.value,
        description: sprintDescriptionDraft,
        expectedEndAt: formatDatetime(datetime)
      }
      apiClient.post('/api/sprints', sprint)
        .then((response) => {
          mutate?.({ id: boardId! })
          closeModal?.()
        })
        .catch((error) => {
          addAlert({ severity: 'error', message: 'Something went wrong!' })
        })
    }
  }

  const endSprintOnClick = () => {
    apiClient.put(`/api/sprints/${activeSprint!.id}/end`)
      .then((response) => {
        mutate?.({ id: boardId! })
        mutateList({ id: board!.lists!.at(-1)!.id, axiosOptions: { params: { tasks: 'visible' } } })
        closeModal?.()
      })
      .catch((error) => {
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }
  const formatDate = (dateString: string) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  return (
    <Box className='SprintModal-wrapper' data-color-mode='light'>
      <Card className='SprintModal-paper'>
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
            <CustomAlert confirmAction={endSprintOnClick}
              dismissAction={toggleAlertModalState}
              title='End Sprint?'
              message={`Are you sure you want to end ${activeSprint?.name}?`}
              confirmMessage='Confirm, end sprint' />
          </Box>
        </Modal>
        <Box className='SprintModal-main'>
          <div className='SprintModal-main-header'>
            {!activeSprint ?
              <Typography fontSize={24}>Start new sprint</Typography>              :
              <div className='SprintModal-main-header-active'>
                <Modal
                  open={openReportModal}
                  onClose={() => setOpenReportModal(false)}
                >
                  <Box
                    className='TaskListItem-Modal'
                    sx={{  position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      outline: 0 }}>
                    <ReportModal
                      sprintId = {activeSprint.id}
                      sprintName = {activeSprint.name}
                      sprintDescription = {activeSprint.description}
                      sprintStartedAt = {formatDate(activeSprint.startedAt)}
                      sprintExpectedEndAt = {formatDate(activeSprint.expectedEndAt)}
                    />
                  </Box>
                </Modal>
                <Typography fontSize={24}>View active sprint</Typography>
                <Button
                  onClick={() => setOpenReportModal(true)}
                  color='secondary'
                  variant='outlined'
                >
                  <Typography>Details</Typography>
                </Button>
              </div>}

          </div>
          <div className='SprintModal-main-name'>
            <Typography fontSize={16}>Sprint name</Typography>
            <Card
              className='SprintModal-main-name-card'>
              {!editSprintNameButton ?
                <Typography sx={{ width: '100%', height: '24px' }} onClick={isManager() ? () => editSprintNameOnClick() : undefined}>{activeSprint?.name}</Typography>                :
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
            {activeSprint && editSprintNameButton &&
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
                    onClick={() => setEditSprintNameButton(false)}
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
                ampm={false}
                disabled={isManager() ? undefined : true}
                value={datetime}
                onChange={
                  (newValue) => {
                    setEditDatetimeButton(true)
                    setDatetime(newValue)
                  }}


              />
            </LocalizationProvider>
            {activeSprint && editDatetimeButton &&
            <div className='buttons'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => editDatetime()}
              >
                  Save
              </Button>
              <Button
                variant='text'
                sx={{ color: '#FF0000' }}
                onClick={() => cancelEditDatetime()}
              >
                  Cancel
              </Button>
            </div>}
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
                  rehypePlugins: [[rehypeSanitize] as any]
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
                rehypePlugins={[[rehypeSanitize] as any]}
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
                onClick={toggleAlertModalState}
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
