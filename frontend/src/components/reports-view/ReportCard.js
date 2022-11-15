import * as React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  ListItem,
  IconButton,
  Avatar,
  Skeleton,
  Typography
} from '@mui/material'
import {
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import UserInfo from '../task-card-modal/UserInfo'
import LabeledData from '../LabeledData'

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
  const formatDate = (dateString) => {
    return `${Intl.DateTimeFormat('pl-PL').format(new Date(dateString))}`
  }

  return (
    <Box>
      <ListItem divider>
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
