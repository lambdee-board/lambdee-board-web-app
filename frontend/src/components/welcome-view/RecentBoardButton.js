import * as React from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'

import useWorkspace from '../../api/useWorkspace'
import RecentBoardIcon from '../RecentBoardIcon'

import './RecentBoardButton.sass'

const RecentBoardButton = ({ boardName, boardColour, workspaceId }) => {
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: null })


  if (isLoading || isError) return (
    'xd'
  )


  return (
    <div className='recentBoardButton'>
      <RecentBoardIcon name={workspace.name} size={64} colour={boardColour} />
      <Typography>{workspace.name}/{boardName}</Typography>
    </div>
  )
}

RecentBoardButton.propTypes = {
  boardName: PropTypes.string.isRequired,
  workspaceId: PropTypes.number.isRequired,
  boardColour: PropTypes.string.isRequired
}


export default RecentBoardButton
