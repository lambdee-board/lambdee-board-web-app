import * as React from 'react'
import {

} from '@mui/material'
import PropTypes from 'prop-types'

import useWorkspace from '../../api/useWorkspace'
import RecentBoardIcon from '../RecentBoardIcon'

const RecentBoardButton = ({ boardId, boardName, boardColour, workspaceId }) => {
  const { data: workspace, isLoading, isError } = useWorkspace({ id: workspaceId, axiosOptions: null })


  if (isLoading || isError) return (
    'xd'
  )


  return (
    <RecentBoardIcon name={workspace.name} size={64} colour={boardColour} />
  )
}

RecentBoardButton.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardName: PropTypes.string.isRequired,
  workspaceId: PropTypes.number.isRequired,
  boardColour: PropTypes.string.isRequired
}


export default RecentBoardButton
