import * as React from 'react'
import PropTypes from 'prop-types'
import {
  IconButton,
  Typography,
  InputBase,
  Card
} from '@mui/material'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import './UserTasks.sass'


function UserTasks({ boardId }) {
  return (
    <Card className='UserTasks-card' >
      {boardId}
    </Card>
  )
}

UserTasks.propTypes = {
  boardId: PropTypes.number.isRequired,
}

export default UserTasks
