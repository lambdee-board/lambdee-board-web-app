import * as React from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { useParams } from 'react-router-dom'
import rehypeSanitize from 'rehype-sanitize'

import {
  Typography,
  Box,
  Card,
  Button,
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
  const [datetime, setDatetime] = React.useState<Dayjs | null>(activeSprint?.expectedEndAt ? dayjs(activeSprint.expectedEndAt) : null)
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
    setDatetime(activeSprint!.expectedEndAt ? dayjs(activeSprint!.expectedEndAt) : null)
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
    <Box data-color-mode='light' sx={{ overflowY: 'scroll', maxHeight: '100vh', msOverflowStyle: 'none', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Card sx={{ mt: 3, mb: 3, width: 'calc(100vw - 40px)', maxWidth: '600px', display: 'flex', flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'space-between', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
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
        <Box sx={{ width: '100%', m: 4 }}>
          <Box sx={{ mb: 8 }}>
            {!activeSprint ?
              <Typography sx={{
                fontSize: 24
              }}>Start new sprint</Typography>              :
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                <Typography sx={{
                  fontSize: 24
                }}>View active sprint</Typography>
                <Button
                  onClick={() => setOpenReportModal(true)}
                  color='secondary'
                  variant='outlined'
                >
                  <Typography>Details</Typography>
                </Button>
              </Box>}

          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 16 }}>Sprint name</Typography>
            <Card sx={{ py: 0.75, px: 1, mt: 0.5, width: '46.6%', display: 'flex' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap', flexDirection: 'row', pt: 1, pb: 1, ml: -0.5, mr: -0.5 }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => editSprintName()}
                  >
                  Save
                  </Button>
                  <Button
                    variant='text'
                    sx={{ color: '#FF0000', mx: 0.5 }}
                    onClick={() => setEditSprintNameButton(false)}
                  >
                  Cancel
                  </Button>
                </Box>}
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 16 }}>End date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
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
          </Box>
          <Typography sx={{
            fontSize: 16
          }}>Sprint description</Typography>
          {unsavedDescriptionDraft ? (
            <Typography sx={{ color: '#7d7b7b' }} variant='caption'>
                Unsaved Changes
            </Typography>
          ) : null}
          {descriptionEditorVisible ? (
            <Box sx={{ mb: 2 }}>
              <MDEditor
                value={sprintDescriptionDraft || ''}
                onChange={(val) => { updateSprintDescriptionDraft(val) }}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize] as any]
                }}
              />
              {activeSprint &&
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap', flexDirection: 'row', pt: 1, pb: 1, ml: -0.5, mr: -0.5 }}>
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
                </Box>}
            </Box>
          ) : (

            <Card
              sx={{ mt: 0.5, mb: 2, py: 1, px: 2, minHeight: '160px', cursor: 'pointer', transition: '.1s ease-in', '&:hover': { opacity: 0.8 } }}
              onClick={isManager() ? sprintDescriptionOnClick : undefined}
            >
              <MDEditor.Markdown
                source={sprintDescriptionDraft || '###### Add a description...'}
                rehypePlugins={[[rehypeSanitize] as any]}
              />
            </Card>
          )}
          {sprintFail &&
          <Alert severity='error' sx={{ width: '94%', mb: 2 }}>All values have to be set!</Alert>
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
