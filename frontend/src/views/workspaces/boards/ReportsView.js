import * as React from 'react'
import {
  Box,
  List,
  Button,
  Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboardList,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { addAlert } from '../../../redux/slices/appAlertSlice'
import apiClient from '../../../api/apiClient'
import useWorkspace from '../../../api/useWorkspace'
import useWorkspaceUsers  from '../../../api/useWorkspaceUsers'

import ReportCard from '../../../components/reports-view/ReportCard'

import './ReportsView.sass'


const WorkspaceSettings = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: { params: { boards: 'visible' } } })
  const { data: usersData, mutate: mutateWorkspaceUsers } = useWorkspaceUsers({ id: workspaceId })
  const [assignUserSelectVisible, setAssignUserSelectVisible] = React.useState(false)

  const assignUserButtonOnClick = () => {
    setAssignUserSelectVisible(true)
    setTimeout(() => {
      document.getElementById('assign-user-to-workspace-select').focus()
    }, 50)
  }

  const assignUserSelectOnBlur = () => {
    setAssignUserSelectVisible(false)
  }

  const assignUserSelectOnChange = (e, user) => {
    assignUser(user)
    setAssignUserSelectVisible(false)
  }

  const assignUser = (user) => {
    const payload = { userId: user.id }

    apiClient.post(`/api/workspaces/${workspaceId}/assign_user`, payload)
      .then((response) => {
        // successful request
        mutateWorkspaceUsers((currentUsers) => ([...currentUsers.users, user]))
      })
      .catch((error) => {
        // failed or rejected
        dispatch(addAlert({ severity: 'error', message: 'Something went wrong!' }))
      })
  }


  return (

    <Box className='WorkspaceSettings-wrapper'>
      <Box className='WorkspaceSettings' >
        {isLoading || isError ? (
          <Box></Box>
        ) : (
          <List className='List'>
            <Box className='Reports'>
            </Box>
          </List>
        )}
      </Box>
    </Box>
  )
}

export default WorkspaceSettings


