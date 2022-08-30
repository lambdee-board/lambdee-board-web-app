import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'
import PropTypes from 'prop-types'

import useWorkspace from '../../api/useWorkspace'
import RecentBoardIcon from '../RecentBoardIcon'

import './RecentBoardButton.sass'

const RecentBoardButton = ({ boardId, boardName, boardColour, workspaceId }) => {
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: null })
  const navigate = useNavigate()


  if (isLoading || isError) return (
    'xd'
  )


  return (
    <Box textAlign='center' >
      <Button fullWidth sx={{ textTransform: 'none ' }} className='recentBoardButton' onClick={() => navigate(`/workspaces/${workspaceId}/boards/${boardId}`)}>
        <RecentBoardIcon name={workspace.name} size={64} colour={boardColour} />
        <Typography color='black'>{workspace.name}/{boardName}</Typography>
      </Button>
    </Box>
  )
}

RecentBoardButton.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardName: PropTypes.string.isRequired,
  workspaceId: PropTypes.number.isRequired,
  boardColour: PropTypes.string.isRequired
}


export default RecentBoardButton
