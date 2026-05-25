import * as React from 'react'
import {
  Box,
  ListItem,
  Modal
} from '@mui/material'

import UserInfo from '../../task-card-modal/UserInfo'
import LabeledData from '../../LabeledData'
import ReportModal from '../report-modal/ReportModal'


interface Props {
  sprintId: number
  sprintName: string
  sprintDescription: string
  sprintStartedAt: string
  sprintExpectedEndAt: string
  sprintEndedAt?: string
}

const ReportCard = ({ sprintId, sprintName, sprintDescription, sprintStartedAt, sprintExpectedEndAt, sprintEndedAt }: Props) => {
  const [openReportModal, setOpenReportModal] = React.useState(false)
  const formatDate = (dateString: string) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  return (
    <Box>
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
            sprintId={sprintId}
            sprintName={sprintName}
            sprintDescription={sprintDescription}
            sprintStartedAt={formatDate(sprintStartedAt)}
            sprintExpectedEndAt={formatDate(sprintExpectedEndAt)}
            sprintEndedAt={sprintEndedAt ? formatDate(sprintEndedAt) : undefined} />
        </Box>
      </Modal>
      <ListItem divider onClick={() => setOpenReportModal(true)} sx={{ transition: '.1s ease-in', cursor: 'pointer', '&:hover': { backgroundColor: '#f7f7f7' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <UserInfo userName={sprintName} userTitle={sprintDescription} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <LabeledData label='Sprint Start' data={formatDate(sprintStartedAt)} />
            <LabeledData label='Sprint Expected End' data={formatDate(sprintExpectedEndAt)} />
            <LabeledData label='Sprint End' data={sprintEndedAt ? formatDate(sprintEndedAt) : undefined} />
          </Box>
        </Box>
      </ListItem>
    </Box>
  )
}

export default ReportCard
