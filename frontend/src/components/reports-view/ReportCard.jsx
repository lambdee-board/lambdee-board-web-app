import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  ListItem,
  Avatar,
  Skeleton,
  Modal
} from '@mui/material'

import UserInfo from '../task-card-modal/UserInfo'
import LabeledData from '../LabeledData'
import ReportModal from './ReportModal'

import './ReportCard.sass'


const ReportCardSkeleton = () => {
  return (
    <div>
      <ListItem divider>
        <div className='UserListItem'>
          <div className='UserListItem-base'>
            <Avatar className='UserListItem-avatar' />
            <Skeleton height={36} width={200} variant='text' />
          </div>
          <Skeleton height={36} width={100} variant='text' />
          <Skeleton height={36} width={100} variant='text' />
        </div>
      </ListItem>
    </div>
  )
}

const ReportCard = (props) => {
  const [openReportModal, setOpenReportModal] = React.useState(false)
  const formatDate = (dateString) => {
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
            sprintId = {props.sprintId}
            sprintName = {props.sprintName}
            sprintDescription = {props.sprintDescription}
            sprintStartedAt = {formatDate(props.sprintStartedAt)}
            sprintExpectedEndAt = {formatDate(props.sprintExpectedEndAt)}
            sprintEndedAt = {props.sprintEndedAt ? formatDate(props.sprintEndedAt) : null} />
        </Box>
      </Modal>
      <ListItem className='UserList' divider onClick={() => setOpenReportModal(true)}>
        <Box className='UserListItem'>

          <div className='UserListItem-base'>
            <UserInfo userName={props.sprintName} userTitle={props.sprintDescription} />
          </div>
          <div className='UserListItem-dates'>
            <LabeledData label='Sprint Start' data={formatDate(props.sprintStartedAt)} />
            <LabeledData label='Sprint Expected End' data={formatDate(props.sprintExpectedEndAt)} />
            <LabeledData label='Sprint End' data={props.sprintEndedAt ? formatDate(props.sprintEndedAt) : null} />
          </div>
        </Box>
      </ListItem>
    </Box>
  )
}

export default ReportCard
export { ReportCardSkeleton }

ReportCard.propTypes = {
  sprintId: PropTypes.number.isRequired,
  sprintName: PropTypes.string.isRequired,
  sprintDescription: PropTypes.string.isRequired,
  sprintStartedAt: PropTypes.string.isRequired,
  sprintExpectedEndAt: PropTypes.string.isRequired,
  sprintEndedAt: PropTypes.string
}
